from flask import Flask, render_template, jsonify, send_file
from flask_socketio import SocketIO, emit
import sqlite3
import os
import json
import redis

app = Flask(__name__)
socketio = SocketIO(app)

db_folder_path = "D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\app_runner"
db_path = os.path.join(db_folder_path, 'paths.db')

redis_host = 'localhost'
redis_port = 6379
redis_client = redis.StrictRedis(host=redis_host, port=redis_port, decode_responses=True)

channel_name = 'my_channel'
pubsub = redis_client.pubsub()
pubsub.subscribe(channel_name)


for message in pubsub.listen():
    if message['type'] == 'message':
        received_data = message['data']
        print(f"Received data: {received_data}")
        with open('file_paths.txt', 'a') as f:
            f.write(received_data)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_data')
def get_data():
    data = read_data_from_db()
    return jsonify(data)

@app.route('/get_image/<path:image_path>/<image_name>')
def get_image(image_path, image_name):
    full_image_path = f'D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\{image_path}\\{image_name}.png'
    return send_file(full_image_path, mimetype='image/png')

@app.route('/get_final_image/<image_name>')
def get_final_image( image_name):
    full_image_path = f'D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\{image_name}.png'
    return send_file(full_image_path, mimetype='image/png')

def read_data_from_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    query = 'SELECT trial, path FROM trials'  
    cursor.execute(query)
    data = cursor.fetchall()
    try:
        new_data = []
        for item in data:
            with open(str(item[1]), 'r') as f:
                json_file = json.load(f)
                model_path = os.path.dirname(str(item[1]))
                new_data.append((item[0] , model_path, json_file['metrics']["metrics"]))
    except Exception as e:
        print(e)
        new_data = []

    conn.close()
    return new_data

if __name__ == '__main__':
    socketio.run(app, port=8082)
    # app.run(port=8082)