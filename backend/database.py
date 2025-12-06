from flask import g
import sqlite3


def connect():
    if 'db' not in g:
        g.db = sqlite3.connect("dev.db")
        g.cursor = g.db.cursor()
        
        # g.db.row_factory = sqlite3.Row
        # g.cursor.execute("SELECT * FROM users")


def save():
    return g.db.commit()

def close():
    return g.db.close()


def migrate_hash_column_to_null():
    """Migrate hash column from NOT NULL to NULL for OAuth users"""
    conn = sqlite3.connect("dev.db")
    cursor = conn.cursor()
    
    # cursor.execute("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, username VARCHAR(255) NOT NULL, hash VARCHAR(255) NULL, oauth_provider VARCHAR(255) NULL)")
    # conn.close()

# Add this to your app initialization
migrate_hash_column_to_null()






