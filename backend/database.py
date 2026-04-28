import sqlite3
import os
from datetime import datetime
import bcrypt

DB_FILE = "scans.db"

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            decoded_data TEXT,
            code_type TEXT,
            scan_time DATETIME
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def add_user(email, password):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        hashed_pw = get_password_hash(password)
        c.execute('INSERT INTO users (email, password) VALUES (?, ?)', (email, hashed_pw))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()

def get_user_by_email(email):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT id, email, password FROM users WHERE email = ?', (email,))
    row = c.fetchone()
    conn.close()
    if row:
        return {"id": row[0], "email": row[1], "password": row[2]}
    return None

def add_scan(decoded_data, code_type):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    scan_time = datetime.now().isoformat()
    c.execute('INSERT INTO scans (decoded_data, code_type, scan_time) VALUES (?, ?, ?)',
              (decoded_data, code_type, scan_time))
    conn.commit()
    scan_id = c.lastrowid
    conn.close()
    return scan_id

def get_scans(limit=50):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT id, decoded_data, code_type, scan_time FROM scans ORDER BY scan_time DESC LIMIT ?', (limit,))
    rows = c.fetchall()
    conn.close()
    return [{"id": r[0], "decoded_data": r[1], "code_type": r[2], "scan_time": r[3]} for r in rows]

# Initialize DB on load
init_db()
