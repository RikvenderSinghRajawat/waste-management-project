from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import mysql.connector

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with your actual secret key

# Database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345",
    database="waste_management"
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']

        cursor = db.cursor()
        cursor.execute("INSERT INTO Users (name, email, password) VALUES (%s, %s, %s)", (name, email, password))
        db.commit()
        return redirect(url_for('login'))

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        cursor = db.cursor()
        cursor.execute("SELECT user_id, name FROM Users WHERE email=%s AND password=%s", (email, password))
        user = cursor.fetchone()

        if user:
            session['user_id'] = user[0]
            session['user_name'] = user[1]
            return redirect(url_for('dashboard'))
        else:
            return "Login failed, please check your credentials."

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('user_name', None)
    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    cursor = db.cursor()
    
    # Fetch all complaints
    cursor.execute("SELECT c.complaint_id, u.name, c.complaint, c.status FROM Complaints c JOIN Users u ON c.user_id = u.user_id")
    complaints = cursor.fetchall()

    return render_template('dashboard.html', complaints=complaints)

@app.route('/complaints', methods=['GET', 'POST'])
def complaints():
    if request.method == 'POST':
        user_id = session['user_id']
        complaint = request.form['complaint']

        cursor = db.cursor()
        cursor.execute("INSERT INTO Complaints (user_id, complaint) VALUES (%s, %s)", (user_id, complaint))
        db.commit()
        return redirect(url_for('dashboard'))

    return render_template('complaints.html')

@app.route('/waste_collection', methods=['GET', 'POST'])
def waste_collection():
    if request.method == 'POST':
        location = request.form['location']
        waste_type = request.form['waste_type']
        weight = request.form['weight']

        cursor = db.cursor()
        cursor.execute("INSERT INTO WasteCollection (location, waste_type, weight_kg) VALUES (%s, %s, %s)", (location, waste_type, weight))
        
        # Update Waste Trends with the new data
        cursor.execute("INSERT INTO WasteTrends (location, waste_type, total_weight) VALUES (%s, %s, %s) "
                       "ON DUPLICATE KEY UPDATE total_weight = total_weight + VALUES(total_weight)", (location, waste_type, weight))
        
        db.commit()
        return redirect(url_for('dashboard'))

    return render_template('waste_collection.html')

@app.route('/waste_trends')
def waste_trends():
    cursor = db.cursor()
    cursor.execute("SELECT location, waste_type, total_weight, recorded_at FROM WasteTrends")
    trends = cursor.fetchall()
    return render_template('waste_trends.html', trends=trends)

if __name__ == '__main__':
    app.run(debug=True)
