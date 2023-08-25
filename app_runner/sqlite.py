import sqlite3
import os

# TODO: Make it dynamic
folder_path = "D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\app_runner"

db_path = os.path.join(folder_path, 'paths.db')

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Delete all rows from the table
    delete_query = "DELETE FROM trials"  # Change "your_table" to your actual table name
    cursor.execute(delete_query)
    
    # Commit changes and close the connection
    conn.commit()
    conn.close()
    
    print("Existing data deleted")

else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(""" CREATE table IF NOT EXISTS trials (
            trial text PRIMARY KEY,
            path text
    )""")

    conn.commit()

    conn.close()