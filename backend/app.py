from flask import Flask, render_template, request, redirect, url_for, session
import mysql.connector
import os
from werkzeug.utils import secure_filename

# Initialize the Flask app
app = Flask(__name__)
app.secret_key = "your_secret_key"  # Ensure the secret key is kept safe

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345",  # Replace with your database password
    database="waste_management"
)

# Path for saving profile pictures
UPLOAD_FOLDER = 'static/profile_pics'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Function to check if the file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to create a default admin if it doesn't exist
def create_default_admin():
    cursor = db.cursor()
    cursor.execute("SELECT COUNT(*) FROM Users WHERE email = 'Rikvendrarajput@gmail.com'")
    if cursor.fetchone()[0] == 0:  # Check if admin doesn't exist
        cursor.execute("""
            INSERT INTO Users (name, email, password, profile_pic, is_admin)
            VALUES ('Rishi', 'Rikvendrarajput@gmail.com', %s, '/static/profile_pics/admin_default.jpeg', 1)
        """, ('admin123',))  # Admin password stored directly (plain text) for simplicity
        db.commit()

create_default_admin()

# Routes
@app.route('/')
def index():
    return render_template('index.html')  # Render the homepage

# Login route (GET and POST)
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        cursor = db.cursor()
        cursor.execute("SELECT user_id, name, profile_pic, is_admin, password FROM Users WHERE email = %s", (email,))
        user = cursor.fetchone()

        # Check password directly without hashing
        if user and user[4] == password:
            session['user_id'] = user[0]
            session['user_name'] = user[1]
            session['profile_pic'] = user[2]
            session['is_admin'] = user[3]
            
            # Redirect based on user role
            if user[3] == 1:
                return redirect(url_for('admin_dashboard'))
            else:
                return redirect(url_for('dashboard'))
        else:
            return "Invalid credentials!", 401

    return render_template('login.html')  # Render login page

# Registration route (GET and POST)
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']

        # Handle profile picture upload
        file = request.files['profile_pic']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            profile_pic = f"/static/profile_pics/{filename}"
        else:
            profile_pic = '/static/profile_pics/default.jpeg'  # Default profile pic

        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO Users (name, email, password, profile_pic, is_admin)
            VALUES (%s, %s, %s, %s, 0)
        """, (name, email, password, profile_pic))  # Store password directly for now
        db.commit()
        return redirect(url_for('login'))

    return render_template('register.html')  # Render registration page

# User Dashboard route
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))  # Ensure user is logged in

    cursor = db.cursor()
    cursor.execute("""
        SELECT u.name, c.complaint, c.status
        FROM Complaints c
        JOIN Users u ON c.user_id = u.user_id
    """)
    all_complaints = cursor.fetchall()

    return render_template('dashboard.html', 
                           all_complaints=all_complaints,
                           profile_pic=session.get('profile_pic'), 
                           user_name=session.get('user_name'))

# Route to show user's complaints
@app.route('/my_complaints')
def my_complaints():
    if 'user_id' not in session:
        return redirect(url_for('login'))  # Ensure user is logged in

    cursor = db.cursor()
    cursor.execute("SELECT complaint_id, complaint, status FROM Complaints WHERE user_id = %s", (session['user_id'],))
    user_complaints = cursor.fetchall()

    return render_template('my_complaints.html', user_complaints=user_complaints)

# Waste collection history route
@app.route('/my_waste_collection')
def my_waste_collection():
    if 'user_id' not in session:
        return redirect(url_for('login'))  # Ensure user is logged in

    cursor = db.cursor()
    cursor.execute("SELECT * FROM WasteCollection WHERE user_id = %s", (session['user_id'],))
    user_waste = cursor.fetchall()
    
    return render_template('my_waste_collection.html', waste=user_waste)

# Route for submitting a waste collection request
@app.route('/waste_collection', methods=['GET', 'POST'])
def waste_collection():
    if request.method == 'POST':
        location = request.form['location']
        waste_type = request.form['waste_type']
        weight = request.form['weight']

        cursor = db.cursor()
        cursor.execute("INSERT INTO WasteCollection (user_id, location, waste_type, weight_kg) VALUES (%s, %s, %s, %s)", 
                       (session['user_id'], location, waste_type, weight))
        db.commit()
        return redirect(url_for('dashboard'))

    return render_template('waste_collection.html')  # Render waste collection form

# Route to show waste trends (location and waste type statistics)
@app.route('/waste_trends')
def waste_trends():
    cursor = db.cursor()
    cursor.execute("SELECT location, waste_type, SUM(weight_kg) AS total_weight FROM WasteCollection GROUP BY location, waste_type")
    trends = cursor.fetchall()
    return render_template('waste_trends.html', trends=trends)

# Route for submitting complaints
@app.route('/complaints', methods=['GET', 'POST'])
def complaints():
    if request.method == 'POST':
        complaint_text = request.form['complaint']
        cursor = db.cursor()
        cursor.execute("INSERT INTO Complaints (user_id, complaint, status) VALUES (%s, %s, 'Pending')", 
                       (session['user_id'], complaint_text))
        db.commit()
        return redirect(url_for('my_complaints'))

    return render_template('complaints.html')  # Render complaints form

# Logout route
@app.route('/logout')
def logout():
    session.clear()  # Clear session data
    return redirect(url_for('index'))  # Redirect to homepage

# Admin dashboard route
@app.route('/admin_dashboard')
def admin_dashboard():
    if 'user_id' not in session or not session.get('is_admin'):
        return redirect(url_for('login'))  # Ensure only admin can access

    cursor = db.cursor()
    cursor.execute("""
        SELECT u.name, c.complaint, c.status
        FROM Complaints c
        JOIN Users u ON c.user_id = u.user_id
    """)
    all_complaints = cursor.fetchall()

    return render_template('admin_dashboard.html', 
                           all_complaints=all_complaints,
                           profile_pic=session.get('profile_pic'), 
                           user_name=session.get('user_name'))

# Admin route to view all users
@app.route('/user_list')
def user_list():
    if 'user_id' not in session or not session.get('is_admin'):
        return redirect(url_for('login'))  # Ensure only admin can access

    cursor = db.cursor()
    cursor.execute("SELECT user_id, name, email, profile_pic, is_admin FROM Users")
    users = cursor.fetchall()

    return render_template('user_list.html', users=users)

# Admin route to update complaints status
@app.route('/update_complaints', methods=['GET', 'POST'])
def update_complaints():
    if 'user_id' not in session or not session.get('is_admin'):
        return redirect(url_for('login'))  # Ensure only admin can access

    cursor = db.cursor()
    if request.method == 'POST':
        complaint_id = request.form['complaint_id']
        status = request.form['status']

        cursor.execute("UPDATE Complaints SET status = %s WHERE complaint_id = %s", (status, complaint_id))
        db.commit()

    cursor.execute("SELECT complaint_id, complaint, status FROM Complaints")
    complaints = cursor.fetchall()

    return render_template('update_complaints.html', complaints=complaints)

# Admin route to update user roles
@app.route('/update_user_role/<int:user_id>', methods=['GET', 'POST'])
def update_user_role(user_id):
    if 'user_id' not in session or not session.get('is_admin'):
        return redirect(url_for('login'))  # Ensure only admin can access

    cursor = db.cursor()
    if request.method == 'POST':
        is_admin = request.form['is_admin']
        cursor.execute("UPDATE Users SET is_admin = %s WHERE user_id = %s", (is_admin, user_id))
        db.commit()

        return redirect(url_for('user_list'))  # Redirect to user list after role update

    cursor.execute("SELECT user_id, name, is_admin FROM Users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()

    return render_template('update_user_role.html', user=user)

if __name__ == '__main__':
    app.run(debug=True)
