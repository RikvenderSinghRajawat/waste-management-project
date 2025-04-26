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
    database="waste"
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
    cursor.execute("SELECT COUNT(*) FROM Users WHERE email = 'khushi@gmail.com'")
    if cursor.fetchone()[0] == 0:  # Check if admin doesn't exist
        cursor.execute("""
            INSERT INTO Users (name, email, password, profile_pic, is_admin)
            VALUES ('khushi', 'khushi@gmail.com', %s, '/static/profile_pics/admin_default.jpeg', 1)
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
    
    # Get all complaints for the community feed
    cursor.execute("""
        SELECT u.name, c.camplain, c.status, c.camplain_id
        FROM camplain c
        JOIN Users u ON c.user_id = u.user_id
        ORDER BY c.camplain_id DESC
    """)
    all_complaints = cursor.fetchall()
    
    # Get user's complaint count
    cursor.execute("SELECT COUNT(*) FROM camplain WHERE user_id = %s", (session['user_id'],))
    user_complaints_count = cursor.fetchone()[0]
    
    # Get user's waste collection count
    cursor.execute("SELECT COUNT(*) FROM WasteCollection WHERE user_id = %s", (session['user_id'],))
    user_collections_count = cursor.fetchone()[0]
    
    # Calculate environmental impact (sum of waste collected in kg)
    cursor.execute("SELECT COALESCE(SUM(weight_kg), 0) FROM WasteCollection WHERE user_id = %s", (session['user_id'],))
    user_eco_impact = cursor.fetchone()[0]
    
    # Get user's recent complaints
    cursor.execute("SELECT camplain_id, camplain, status FROM camplain WHERE user_id = %s ORDER BY camplain_id DESC LIMIT 5", 
                   (session['user_id'],))
    user_complaints = cursor.fetchall()

    return render_template('dashboard.html', 
                           all_complaints=all_complaints,
                           user_complaints=user_complaints,
                           profile_pic=session.get('profile_pic'), 
                           user_name=session.get('user_name'),
                           user_complaints_count=user_complaints_count,
                           user_collections_count=user_collections_count,
                           user_eco_impact=user_eco_impact)

# Route to show user's camplain
@app.route('/my_camplain')
def my_camplain():
    if 'user_id' not in session:
        return redirect(url_for('login'))  # Ensure user is logged in

    cursor = db.cursor()
    cursor.execute("SELECT camplain_id, camplain, status FROM camplain WHERE user_id = %s", (session['user_id'],))
    user_camplain = cursor.fetchall()

    return render_template('my_camplain.html', 
                          user_camplain=user_camplain,
                          profile_pic=session.get('profile_pic'),
                          user_name=session.get('user_name'))

# Waste collection history route
@app.route('/my_waste_collection')
def my_waste_collection():
    if 'user_id' not in session:
        return redirect(url_for('login'))  # Ensure user is logged in

    cursor = db.cursor()
    cursor.execute("SELECT * FROM WasteCollection WHERE user_id = %s", (session['user_id'],))
    user_waste = cursor.fetchall()
    
    return render_template('my_waste_collection.html', 
                          waste=user_waste,
                          profile_pic=session.get('profile_pic'),
                          user_name=session.get('user_name'))

# Route for submitting a waste collection request
@app.route('/waste_collection', methods=['GET', 'POST'])
def waste_collection():
    if 'user_id' not in session:
        return redirect(url_for('login'))
        
    if request.method == 'POST':
        location = request.form['location']
        waste_type = request.form['waste_type']
        weight = request.form['weight']

        cursor = db.cursor()
        cursor.execute("INSERT INTO WasteCollection (user_id, location, waste_type, weight_kg) VALUES (%s, %s, %s, %s)", 
                       (session['user_id'], location, waste_type, weight))
        db.commit()
        return redirect(url_for('dashboard'))

    return render_template('waste_collection.html',
                          profile_pic=session.get('profile_pic'),
                          user_name=session.get('user_name'))

# Route to show waste trends (location and waste type statistics)
@app.route('/waste_trends')
def waste_trends():
    if 'user_id' not in session:
        return redirect(url_for('login'))
        
    cursor = db.cursor()
    cursor.execute("SELECT location, waste_type, SUM(weight_kg) AS total_weight FROM WasteCollection GROUP BY location, waste_type")
    trends = cursor.fetchall()
    
    return render_template('waste_trends.html', 
                          trends=trends,
                          profile_pic=session.get('profile_pic'),
                          user_name=session.get('user_name'))

# Route for submitting camplain
@app.route('/camplain', methods=['GET', 'POST'])
def camplain():
    if 'user_id' not in session:
        return redirect(url_for('login'))
        
    if request.method == 'POST':
        camplain_text = request.form['camplain']
        cursor = db.cursor()
        cursor.execute("INSERT INTO camplain (user_id, camplain, status) VALUES (%s, %s, 'Pending')", 
                       (session['user_id'], camplain_text))
        db.commit()
        return redirect(url_for('my_camplain'))

    return render_template('camplain.html',
                          profile_pic=session.get('profile_pic'),
                          user_name=session.get('user_name'))

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
    
    # Get all complaints with correct column names
    cursor.execute("""
        SELECT u.name, c.camplain, c.status, c.camplain_id
        FROM camplain c
        JOIN Users u ON c.user_id = u.user_id
        ORDER BY c.camplain_id DESC
        LIMIT 10
    """)
    all_complaints = cursor.fetchall()
    
    # Get counts for dashboard statistics
    # 1. Total complaints count
    cursor.execute("SELECT COUNT(*) FROM camplain")
    complaint_count = cursor.fetchone()[0]
    
    # 2. Total users count
    cursor.execute("SELECT COUNT(*) FROM Users")
    user_count = cursor.fetchone()[0]
    
    # 3. Total waste collected (sum of weight)
    cursor.execute("SELECT COALESCE(SUM(weight_kg), 0) FROM WasteCollection")
    waste_collected = cursor.fetchone()[0]
    
    # 4. Resolved issues count
    cursor.execute("SELECT COUNT(*) FROM camplain WHERE status = 'Complete'")
    resolved_count = cursor.fetchone()[0]

    return render_template('admin_dashboard.html', 
                           all_complaints=all_complaints,
                           profile_pic=session.get('profile_pic'), 
                           user_name=session.get('user_name'),
                           complaint_count=complaint_count,
                           user_count=user_count,
                           waste_collected=waste_collected,
                           resolved_count=resolved_count)

# Admin route to view all users
@app.route('/user_list')
def user_list():
    if 'user_id' not in session or not session.get('is_admin'):
        return redirect(url_for('login'))  # Ensure only admin can access

    cursor = db.cursor()
    cursor.execute("SELECT user_id, name, email, profile_pic, is_admin FROM Users")
    users = cursor.fetchall()

    return render_template('user_list.html', 
                          users=users,
                          profile_pic=session.get('profile_pic'),
                          user_name=session.get('user_name'))

# Admin route to update camplain status
@app.route('/update_complaints', methods=['GET', 'POST'])
def update_complaints():
    if 'user_id' not in session or not session.get('is_admin'):
        return redirect(url_for('login'))  # Ensure only admin can access

    cursor = db.cursor()
    if request.method == 'POST':
        camplain_id = request.form['camplain_id']
        status = request.form['status']

        cursor.execute("UPDATE camplain SET status = %s WHERE camplain_id = %s", (status, camplain_id))
        db.commit()

    cursor.execute("""
        SELECT c.camplain_id, c.camplain, c.status, u.name 
        FROM camplain c
        JOIN Users u ON c.user_id = u.user_id
        ORDER BY c.camplain_id DESC
    """)
    complaints = cursor.fetchall()
    
    return render_template('update_complaints.html', 
                          complaints=complaints,
                          profile_pic=session.get('profile_pic'),
                          user_name=session.get('user_name'))

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

    return render_template('update_user_role.html', 
                          user=user,
                          profile_pic=session.get('profile_pic'),
                          user_name=session.get('user_name'))

@app.route('/delete_user/<int:user_id>', methods=['POST'])
def delete_user(user_id):
    if 'user_id' not in session or not session.get('is_admin'):
        return redirect(url_for('login'))

    cursor = db.cursor()
    cursor.execute("DELETE FROM Users WHERE user_id = %s", (user_id,))
    db.commit()

    return redirect(url_for('user_list'))

# Route to update a specific complaint's status
@app.route('/update_complaint_status', methods=['POST'])
def update_complaint_status():
    if 'user_id' not in session or not session.get('is_admin'):
        return redirect(url_for('login'))

    complaint_id = request.form['complaint_id']
    if request.form['action'] == 'mark_complete':
        cursor = db.cursor()
        cursor.execute("UPDATE camplain SET status = 'Complete' WHERE camplain_id = %s", (complaint_id,))
        db.commit()

    return redirect(url_for('update_complaints'))

# Route to delete a complaint
@app.route('/delete_complaint', methods=['POST'])
def delete_complaint():
    if 'user_id' not in session or not session.get('is_admin'):
        return redirect(url_for('login'))

    complaint_id = request.form['complaint_id']
    cursor = db.cursor()
    cursor.execute("DELETE FROM camplain WHERE camplain_id = %s", (complaint_id,))
    db.commit()

    return redirect(url_for('update_complaints'))

if __name__ == '__main__':
    app.run(debug=True)