import sys
from flask import Flask, request, render_template, send_file, jsonify
from flask_socketio import SocketIO
from flask_restful import Api, Resource, reqparse
import os
import json

app = Flask(__name__)
socketio = SocketIO(app)
api = Api(app)

@app.route('/')
def index():
    return render_template('index.html')

# Define a Flask-RESTful resource for getting images
class GetImageResource(Resource):
    def get(self, image_path, image_name):
        full_image_path = f'D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier\\{image_path}\\{image_name}.png'
        return send_file(full_image_path, mimetype='image/png')

# Define a Flask-RESTful resource for getting the final image
class GetFinalImageResource(Resource):
    def get(self, image_type):
        if image_type == 'final_model':
            full_image_path = 'D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier\\test_model.png'
            return send_file(full_image_path, mimetype='image/png')
        elif image_type == 'preprocessing_model':
            full_image_path = 'D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier\\preprocessing_model.png'
            return send_file(full_image_path, mimetype='image/png')
        elif image_type == 'dense_model':
            full_image_path = 'D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier\\dense_model.png'
            return send_file(full_image_path, mimetype='image/png')

# Define a Flask-RESTful resource for updating data
class UpdateDataResource(Resource):
    def __init__(self):
        self.models = set()
        self.keywords = ["test_model", "preprocessing_model", "dense_model"]

    def post(self):
        args = request.get_json()
        filepath = args['data']['filepath']
        print(filepath)
        if any(keyword in filepath for keyword in self.keywords):
            if filepath not in self.models:
                socketio.emit('update',filepath)
                self.models.add(filepath)
        else:
            socketio.emit('update',filepath)

        return {"message": "Data updated successfully"}, 200


class ExplorePreprocessing(Resource):
    def get(self):
        # Your preprocessing logic here
        result = "Preprocessing result"
        return {"result": result}

# Define a Flask-RESTful resource for closing the app
@app.route('/close_app', methods=['GET'])
def close_app():
    os.kill(os.getpid(), 9)
    sys.exit()

# Add resources to the API with their respective endpoints
api.add_resource(GetImageResource, '/get_image/<path:image_path>/<image_name>')
api.add_resource(GetFinalImageResource, '/get_final_image/<path:image_type>')
api.add_resource(UpdateDataResource, '/update_data')
api.add_resource(ExplorePreprocessing, '/explore_preprocessing')

@socketio.on('connect')
def handle_connect():
    print("Websocket connected")
    
if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=8082, debug=True)
