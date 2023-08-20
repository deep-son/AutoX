import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import json
import os
import random

# Define the file to monitor
file_to_monitor = 'D:\Courses\Master Thesis\automl_exp\structured_data_classifier\oracle.json'
json_file_path = 'D:\Courses\Master Thesis\automl_exp'

# Define a handler to respond to file events
class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path == file_to_monitor:
            print("File modified:", event.src_path)
            load_file_content()

# Define a function to load file content
def load_file_content():
    with open(file_to_monitor, 'r') as json_file:
        data = json.load(json_file)
    
    num = str(random.randint()) + ".json"
    with open(os.path.join(json_file_path, num), 'w') as json_file:
        json.dump(data, json_file, indent=4)

if __name__ == '__main__':
    # Start the file monitor
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=False)
    observer.start()
    print("Running Observer")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
