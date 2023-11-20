import requests
import os
from app_runner.utils.json_ops import read_json

class APIs:
    def __init__(self):
        current_directory = os.path.dirname(os.path.abspath(__file__))
        app_runner_directory = os.path.dirname(current_directory)
        config_path = os.path.join(app_runner_directory, 'config.json')
        config = read_json(config_path)
        self.FLASK_API_URL = config["FLASK_APP_HOST"] + ":" + config["FLASK_APP_PORT"] + "/"

    
    def publish_data(self, message_data, api_endpoint): 
        url = self.FLASK_API_URL + api_endpoint
        response = requests.post(url, json=message_data)
        if response.status_code == 200:
            return "Data sent successfully"
        else:
            return f"Failed to send data: {response.status_code}"