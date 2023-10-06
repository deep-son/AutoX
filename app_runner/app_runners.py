import subprocess
import os
import sys

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