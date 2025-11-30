from flask import g
import sqlite3

def connect():
    if 'db' not in g:
        g.db = sqlite3.connect("dev.db")
        g.cursor = g.db.cursor()
        # g.db.row_factory = sqlite3.Row


def save():
    return g.db.commit()

def close():
    return g.db.close()
