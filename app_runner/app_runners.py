import subprocess

class AppRunner:
    def __init__(self):
        self.flask_app = None

    def start_flask_app(self):
        flask_app_path = "./app_runner/app.py"
        self.flask_app = subprocess.Popen(['python', flask_app_path])

    def stop_flask_app(self):
        self.flask_app.terminate()

class SQLDBRunner:
    @staticmethod
    def start_sqldb():
        sqldb_path = "./app_runner/sqlite.py"
        subprocess.Popen(['python', sqldb_path])

