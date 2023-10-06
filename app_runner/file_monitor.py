import time
import redis
import json
import requests
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from data_generator import DataGenerator

# Configure the logging settings
log_format = '%(asctime)s [%(levelname)s] - %(message)s'
logging.basicConfig(filename='watchdog.log', level=logging.DEBUG, format=log_format)

class MyHandler(FileSystemEventHandler):
    def __init__(self):
        self.trials = {}
        self.generator = DataGenerator()
        self.FLASK_API_URL = "http://127.0.0.1:8082/update_data"

    def on_any_event(self, event):
        # Triggered when a new file is created in the monitored directory
        if not event.is_directory:
            file_path = event.src_path
            logging.info(f"New file created: {file_path}")

            if "trial_" in file_path:
                logging.info(file_path)
                if "trial_mid" in file_path.split()[-1]:
                    logging.info(file_path)
                    self.generator.generate_architecture(file_path)
                    message_data = {
                        "data" : {
                            "filepath": file_path
                        }
                    }
                    self.publish_data(message_data)

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
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
