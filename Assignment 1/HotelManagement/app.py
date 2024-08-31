from flask import Flask, render_template, request, redirect, url_for, session # type: ignore
import MySQLdb
import os
import hashlib

def sha256_hash(text):
    sha256 = hashlib.sha256()
    sha256.update(text.encode('utf-8'))
    return sha256.hexdigest()

app = Flask(__name__)
app.secret_key = 'csl4030'

connection = MySQLdb.connect(
    host="localhost",
    user="root",
    password=os.getenv('MySQL'),
    database="hotel_management"
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        cursor = connection.cursor()
        cursor.execute(f"SELECT * FROM staff WHERE email_id='{email}'")
        user = cursor.fetchone()

        if user:
            stored_password = user[2]

            if sha256_hash(password) == stored_password:
                session['user_id'] = user[0]
                session['username'] = user[3] + ' ' + user[4]
                return redirect(url_for('report', user=user))
            else: return "Invalid Password"
        else: return "Invalid Username"

    return render_template('login.html')

@app.route('/report')
def report():
    if 'user_id' in session:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM staff WHERE id = %s", (session['user_id'],))
        user = cursor.fetchone()
        username = user[3] + " " + user[4]

        cursor.execute("SELECT * FROM bookings")
        bookings = cursor.fetchall()

        cursor.execute("SELECT SUM(r.price * DATEDIFF(b.booking_till, b.booking_date)) AS total_revenue, (COUNT(DISTINCT b.room_no) / (SELECT COUNT(room_no) FROM rooms)) * 100 AS occupancy_percentage FROM  bookings b JOIN rooms r ON b.room_no = r.room_no")
        reports = cursor.fetchone()
        report_ = []
        for rep in reports: report_.append(str(rep))

        return render_template('report.html', bookings=bookings, username=username, reports=report_)
    
    else:
        return redirect(url_for('login'))

@app.route('/room_management', methods=['GET', 'POST'])
def room_management():
    if request.method == 'POST':
        room_number = request.form['room_number']
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM rooms WHERE room_no = %s", (room_number,))
        room_info = cursor.fetchone()

        booking_info = None
        if room_info and room_info[1]:  # Assuming room_info[1] is the status column
            cursor.execute("SELECT * FROM bookings WHERE room_no = %s", (room_number,))
            booking_info = cursor.fetchone()

        if room_info:
            return render_template('room_management.html', room_info=room_info, booking_info=booking_info, username=session['username'])
        else:
            error = f"No information found for room number {room_number}"
            return render_template('room_management.html', error=error, username=session['username'])
    return render_template('room_management.html', username=session['username'])


@app.route('/booking')
def booking():
    return render_template('booking.html')

@app.route('/payment')
def payment():
    return render_template('payment.html')

@app.route('/logout')
def logout():
    return render_template('logout.html')


if __name__ == '__main__':
    app.run(debug=True)