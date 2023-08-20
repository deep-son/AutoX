from flask import Flask, render_template
import concurrent.futures
import os
import time
import json

app = Flask(__name__)

# Global variable to control the thread
stop_thread = False

def check_and_display_files():
    while not stop_thread:
        file_content = {}
        for dirname, subdirs, files in os.walk("../structured_data_classifier"):
            if "trial" in dirname:
                    for filename in files:
                        if "mid" in filename:
                            print(dirname,filename)
                            file_path = os.path.join(dirname, filename)
                            if os.path.isfile(file_path):
                                with open(file_path, "r") as f:
                                    file_content[filename] = json.load(f)
        
        app.config["FILE_CONTENT"] = file_content
        time.sleep(2)  # Check every 1 second


@app.route('/')
def display_file():
    file_content = app.config["FILE_CONTENT"]
    return render_template("index.html", file_content=file_content)

def start_thread():
    print("Reached Start")
    file_check_thread = concurrent.futures.ThreadPoolExecutor(max_workers=2)
    file_check_thread.submit(check_and_display_files)
    

def stop_the_thread():
    global stop_thread
    stop_thread = True

def run_app():
    start_thread()
    print("Starting App")
    app.run(port=8080)
    
if __name__=="__main__":
    # app.run(debug=True, port=8080)
    run_app()
    
    