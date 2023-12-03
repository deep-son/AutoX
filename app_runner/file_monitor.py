import time
import redis
import json
import requests
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from model import ModelGenerator

# Configure the logging settings
log_format = '%(asctime)s [%(levelname)s] - %(message)s'
logging.basicConfig(filename='watchdog.log', level=logging.DEBUG, format=log_format)

class MyHandler(FileSystemEventHandler):
    def __init__(self):
        self.trials = {}
        self.generator = ModelGenerator()
        self.FLASK_API_URL = "http://127.0.0.1:8082/update_data"
        self.STATUS = False

    def on_any_event(self, event):
        if not event.is_directory:
            file_path = event.src_path
            if "trial_" in file_path:
                # logging.info(file_path)
                if "trial_mid" in file_path.split()[-1]:
                    logging.info(file_path)
                    self.STATUS = True
                    arch_status, model_path = self.generator.create_model_architecture(file_path)
                    logging.info(f"Arch_status {arch_status} and model path {model_path}")
                    if arch_status:
                        trial_info = {}
                        try:
                            with open(file_path, 'r') as json_file:
                                data = json.load(json_file)
                            trial_info["values"] = data["hyperparameters"]["values"]
                            trial_info["metrics"] = data["metrics"]
                            trial_info["best_step"] = data.get("best_step","None")
                            trial_info["model_path"] = model_path
                            
                            logging.info(f"Trail Info {trial_info}")
                            self.publish_data(trial_info)
                            
                        except FileNotFoundError:
                            logging.info(f"File not found: {file_path}")
                        except json.JSONDecodeError as e:
                            logging.info(f"Error decoding JSON: {e}")
                    
            if self.STATUS:   
                keywords = ["test_model", "preprocessing_model", "dense_model"]
                if any(keyword in file_path for keyword in keywords):
                    logging.info(file_path)
                    message_data = {
                        "data": {
                            "filepath": file_path
                        }
                    }
                    self.publish_data(message_data)

    def publish_data(self, message_data): 
        response = requests.post(self.FLASK_API_URL, json=message_data)
        if response.status_code == 200:
            logging.info("Data sent successfully")
        else:
            logging.error(f"Failed to send data: {response.status_code}")

if __name__ == "__main__":
    # Define the directory to monitor
    directory_to_watch = "D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier"
    logging.info("Running....")
    # Create an observer to monitor the directory
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path=directory_to_watch, recursive=True)

    # Start monitoring the directory
    observer.start()

    try:
        while True:
            time.sleep(0.1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
