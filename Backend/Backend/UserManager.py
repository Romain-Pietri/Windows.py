import sqlite3
import hashlib

class UserManager:
    def __init__(self, db_name='users.db'):
        self.db_name = db_name
        self.create_table()

    def create_table(self):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
        ''')
        conn.commit()
        conn.close()

    def hash_password(self, password):
        return hashlib.sha256(password.encode()).hexdigest()

    def add_user(self, username, password):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        hashed_password = self.hash_password(password)
        cursor.execute('''
        INSERT INTO users (username, password) VALUES (?, ?)
        ''', (username, hashed_password))
        conn.commit()
        conn.close()

    def check_user(self, username, password):
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        hashed_password = self.hash_password(password)
        cursor.execute('''
        SELECT * FROM users WHERE username = ? AND password = ?
        ''', (username, hashed_password))
        user = cursor.fetchone()
        conn.close()
        
        return user[0] if user else None