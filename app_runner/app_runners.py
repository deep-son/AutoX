import subprocess
import os
import sys
import time
import requests

class AppRunner:
    def __init__(self):
        self.flask_app = None

    def start_flask_app(self):
        flask_app_path = "./app_runner/app.py"
        log_file_path = "./app_runner/flask_app.log"
        with open(log_file_path, 'w') as log_file:
            self.flask_app = subprocess.Popen(['python', flask_app_path], stdout=log_file, stderr=subprocess.STDOUT)

    def stop_flask_app(self):
        self.flask_app.terminate()
    
    def check_if_started(self, port):
        is_started = False
        while True:
            try:
                if is_started:
                    return True
                # Make a GET request to the Flask app
                response = requests.get(f"http://127.0.0.1:{port}")
                # Check if the response status code is 200 (OK)
                if response.status_code == 200:
                    is_started = True
                else:
                    is_started = False
            except requests.exceptions.RequestException:
                is_started = False

class SQLDBRunner:
    @staticmethod
    def start_sqldb():
        sqldb_path = "./app_runner/sqlite.py"
        subprocess.Popen(['python', sqldb_path])

class FileSearchRunner:
    @staticmethod
    def start_fileSearch():
        filemonitor_path = "./app_runner/file_monitor.py"
        subprocess.Popen(['python', filemonitor_path])