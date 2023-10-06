import time
import redis
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from data_generator import DataGenerator

class MyHandler(FileSystemEventHandler):
    def __init__(self):
        self.trials = {}
        self.generator = DataGenerator()
        redis_host = 'localhost'
        redis_port = 6379
        self.channel_name = 'model_arch_path'
        self.redis_client = redis.StrictRedis(host=redis_host, port=redis_port, decode_responses=True)

    def on_modified(self, event):
        # Triggered when a new file is created in the monitored directory
        if not event.is_directory:
            file_path = event.src_path
            print(f"New file created: {file_path}")

            if "trial_" in file_path:
                print(file_path)
                temp = file_path.split()[-1]
                if "trial_mid" in temp:
                    print(file_path)
                    self.generator.generate_architecture(file_path)
                    message_data = {
                        "event": "message_from_watchdog",
                        "data" : {
                            "filepath": file_path
                        }
                    }
                    self.publish_data(message_data)

    def publish_data(self, message_data): 
        self.redis_client.publish(self.channel_name, json.dumps(message_data))


if __name__ == "__main__":
    # Define the directory to monitor
    directory_to_watch = "D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier"
    print("Running....")
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
