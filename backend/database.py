import sqlite3

connection = sqlite3.connect("dev.db")
cursor = connection.cursor()

def save():
    return connection.commit()

def close():
    return connection.close()