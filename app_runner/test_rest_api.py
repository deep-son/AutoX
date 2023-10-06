import time
import requests

while True:
    # Simulate data collection or monitoring process
    message_data = {
                    "data" : {
                        "filepath": "tets_path.int"
                    }
                }  # Replace this with your actual data

    # Send the data to the Flask app using a POST request
    response = requests.post("http://127.0.0.1:8082/update_data", json=message_data)
    
    if response.status_code == 200:
        print("Data sent successfully")
    else:
        print(f"Failed to send data: {response.status_code}")

    time.sleep(5)  # Adjust the interval as needed
