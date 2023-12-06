import sys
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import pandas as pd
import numpy as np
import autokeras as ak
import logging
from causalnex.structure import StructureModel
from causalnex.plots import plot_structure, NODE_STYLE
import json
import plotly.express as px
import tensorflow as tf
import traceback

from flask import Flask, request, render_template, send_file
from flask_socketio import SocketIO
from flask_restful import Api, Resource
import plotly.graph_objects as go
from tensorflow.keras.models import load_model
from tensorflow.keras.models import Model

import requests
from plotly.subplots import make_subplots

from features import FeatureModels


app = Flask(__name__)
socketio = SocketIO(app)
api = Api(app)

app.config['EXTRA_FILES'] = ['C:\\']
log_format = '%(asctime)s [%(levelname)s] - %(message)s'
logging.basicConfig(filename='app.log', level=logging.DEBUG, format=log_format)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/proxy/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def proxy(path):
    # Target URL to TensorBoard
    tensorboard_url = f'http://localhost:6006/{path}'
    raw_body = request.get_data(as_text=True)

    # Forward the request to TensorBoard and retrieve the response
    if request.method == 'GET':
        response = requests.get(tensorboard_url, headers=request.headers)
    elif request.method in ['POST', 'PUT', 'DELETE']:
        response = requests.request(
            method=request.method,
            url=tensorboard_url,
            headers={key: value for key, value in request.headers.items() if key != 'Host'},
            data=raw_body  # pass the decoded data
        )
    try:
        # Try to return JSON response
        return response.json(), response.status_code
    except ValueError:
        # If response is not JSON, return raw response
        return response.content, response.status_code

    
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
        #args trial data
        if len(args) > 2:
            socketio.emit('update',args)
        else:
            filepath = args['data']['filepath']
            if any(keyword in filepath for keyword in self.keywords):
                if filepath not in self.models:
                    socketio.emit('update',args)
                    self.models.add(filepath)
        
        return {"message": "Data updated successfully"}, 200


class SendInitialInfo(Resource):
    def post(self):
        args = request.get_json()
        socketio.emit('initial',args) 
        return {"message": "Data updated successfully"}, 200
    
class UpdateEvaluationResource(Resource):
    def post(self):
        args = request.get_json()
        socketio.emit('evaluation',args)

class ExploreFeatures(Resource):

    def __init__(self):
        self.feat = None
        
    def post(self):
        try:
            logging.info("Status: Received Request for Explore Features")
            project_name = request.args.get('project_name')
            train_file_path = request.args.get('train_file_path')
            explanation_type = request.args.get('explanation_type')
            target_name = request.args.get('target_name')

            try:
                num_rows = int(request.args.get('num_rows'))
            except:
                num_rows = 5

            if hasattr(self.feat, 'project_name'):
                logging.info("already initailized")
            else:
                self.feat = FeatureModels(project_name, train_file_path, target_name)
            
            if explanation_type == 'IG':
                graph = self.feat.plot_integrated_gradients(num_rows)
                return graph
            
            elif explanation_type == 'ALE':
                graph = self.feat.plot_accumulated_local_effects()
                return graph

        except Exception as e:
            logging.error(f"An error occurred: {e}")
            logging.error(traceback.format_exc())



class ExplorePreprocessing(Resource):
    def seperate_model_index(self,model):
        layer_names = [layer.name for layer in model.layers]
        for index, name in enumerate(layer_names):
            if 'dense' in name:
                return index - 1

    def post(self):
        try:
            logging.info("Status: Received Request for Preprocessing Explanation")
            project_name = request.args.get('project_name')
            train_file_path = request.args.get('train_file_path')
            
            current_directory = os.path.dirname(os.path.abspath(__file__))
            model_directory = os.path.dirname(current_directory)
            best_model_path = os.path.join(model_directory, project_name, 'best_model')

            model = load_model(best_model_path, custom_objects=ak.CUSTOM_OBJECTS)
            
            index = self.seperate_model_index(model) 
            preprocessing_model = Model(inputs=model.input, outputs=model.layers[index].output)
            x_train = pd.read_csv(train_file_path.strip(" '"))
            
            cat_to_num = {}
            # Calculate the number of nulls in each column
            null_counts = x_train.isnull().sum()

            # Plot the number of nulls using Plotly
            fig = px.bar(y=null_counts.index, x=null_counts.values, orientation='h', labels={'x': 'Number of Nulls', 'y': 'Columns'},
                title='Number of Nulls in DataFrame Columns')
            cat_to_num['null_graph'] = fig.to_json()
            

            feature_type = {feature: 'numerical' if x_train[feature].dtype in ['int64', 'float64'] else 'categorical' for feature in x_train.columns}
            
            cat_to_num['feature_type'] = feature_type

            x_train[x_train.select_dtypes(include='object').columns] = x_train.select_dtypes(include='object').fillna('0')
            
            # Create a dictionary to store unique values and their string lookup values as strings
            encoded_dict = {}

            
            # Iterate through columns, obtain unique values, and apply StringLookup
            for col in x_train.select_dtypes(include='object').columns:
                unique_values = x_train[col].unique()  # Get unique values
                string_lookup = tf.keras.layers.StringLookup(output_mode='int')  # Create StringLookup instance
                string_lookup.adapt(unique_values)  # Adapt the layer to the data
                encoded_values = string_lookup(unique_values)  # Get string lookup integer values
                # Convert integer values to strings and store in the dictionary
                encoded_dict[col] = {str(val): enc.numpy() for val, enc in zip(unique_values, encoded_values)}

            encoded_dict = {k: {inner_key: str(value) for inner_key, value in v.items()} for k, v in encoded_dict.items()}
            
            
            cat_to_num['encoded_dict'] = encoded_dict
            
            layers = preprocessing_model.layers
            norm_layer_info = {}
            for layer in layers:
                if layer.name=='normalization':
                    variables = layer.non_trainable_variables
                    for var in variables:
                        norm_layer_info[var.name] = {"shape":str(var.shape), "data":var.numpy().tolist()}
            logging.info(f"CategoricalToNumerical:{cat_to_num}")
            logging.info(f"normalization:{norm_layer_info}")
            data_json = {"CategoricalToNumerical": cat_to_num, "Normalization": norm_layer_info}

            logging.info("Done: Returned")
            return data_json
            
        
        except Exception as e:
            logging.error(f"An error occurred: {e}")
            logging.error(traceback.format_exc())


class ExploreTuner(Resource):

    def __init__(self):
        self.json_package = {}
    
    def post(self):
        try:
            logging.info("Status: Received Request for Tuner Explanation")
            project_name = request.args.get('project_name')
            current_directory = os.path.dirname(os.path.abspath(__file__))
            model_directory = os.path.dirname(current_directory)
            directory_path = os.path.join(model_directory, project_name)
            

            # List all JSON files that start with "decision_factors"
            decision_factors_files = [file for file in os.listdir(directory_path) if file.startswith("decision_factors") and file.endswith(".json")]

            # check the type of tuner
            check_file = os.path.join(directory_path, decision_factors_files[0])
            try:
                with open(check_file, "r") as json_file:
                    data = json.load(json_file)
                    tuner_type = data["tuner"]
            except Exception as e:
                print("Error here")
                print(e)
            
            if tuner_type == "greedy":

                tuner_graphs_directory = os.path.join(directory_path, 'tuner_graphs')
                if not os.path.exists(tuner_graphs_directory):
                    os.makedirs(tuner_graphs_directory)

                for file_name in decision_factors_files:
                    file_path = os.path.join(directory_path, file_name)

                    try:
                        with open(file_path, "r") as json_file:
                            data = json.load(json_file)
                            # Process the data from the JSON fil
                            trie_data = data["trie_json"]
                            best = data["hp_names"]

                        def add_nodes_to_causalnex(graph, node_data, parent=None):
                            for key, value in node_data['children'].items():
                                # Add nodes to the StructureModel
                                graph.add_node(key, num_leaves=value['num_leaves'], hp_name=value['hp_name'])
                                
                                if parent is not None:
                                    # Add edges to the StructureModel
                                    graph.add_edge(parent, key)
                                
                                # Recursively add nodes and edges
                                add_nodes_to_causalnex(graph, value, key)

                        split_best = best[0].split('/')
                        node_attributes = {i : {"borderWidth": 10,"color":"#0b61bc"} for i in split_best}
                        edge_attributes = {(split_best[i],split_best[i+1]) : {"color":"#0b61bc"} for i in range(len(split_best)-1)}
                        # Create an empty StructureModel
                        sm = StructureModel()
                        all_edge_attributes = {
                            "color":{
                                "color": "#FFFFFFD9",
                                "highlight": "#3c4a59",
                            },
                            "length": 100,
                        }
                        # Add nodes and edges to the StructureModel
                        add_nodes_to_causalnex(sm, trie_data)

                        # Visualize the StructureModel

                        viz = plot_structure(
                            sm,
                            all_node_attributes=NODE_STYLE.WEAK,
                            all_edge_attributes=all_edge_attributes,
                            node_attributes=node_attributes,
                            edge_attributes=edge_attributes,
                        )
                        opt = {
                            "layout":
                                {
                                    "hierarchical": {
                                        "enabled": True,
                                        "direction": "UD", #UD means that the hierarchy is displayed up to down
                                        "sortMethod": "directed",
                                        "nodeSpacing": 100,
                                        "treeSpacing": 200,
                                        "levelSeparation": 170,
                                    }
                                },
                        }

                        viz.set_options(options=json.dumps(opt))
                        
                        trial_id = data["trial_id"]
                        graph_file_name = f'tuner_{trial_id}.html'
                        graph_file_path = os.path.join(tuner_graphs_directory, graph_file_name)

                        # viz.save_graph(graph_file_path)
                        data["casualnex_graph_path"] = viz.to_json()

                        data.pop('trie_json', "Not found")

                        # preprocess probabilitie
                        node_names = data.pop('node_hp_name', "Not found")
                        probabilities = data.pop('probabilities', "Not found")

                        prob_values = {}
                        for i,j in zip(node_names,probabilities):
                            if i is not None:
                                prob_values[i] = j
                        
                        data["probabilities"] = prob_values
                        self.json_package[data["trial_id"]] = data

                    except Exception as e:
                        print(e)

                return self.json_package
            
            # explanation for bayesian tuner
            else:
                for file_name in decision_factors_files:
                    file_path = os.path.join(directory_path, file_name)

                    try:
                        with open(file_path, "r") as json_file:
                            data = json.load(json_file)

                        if "vectorized_x" in data:
                            vectorized_x = data.pop('vectorized_x', "Not found")

                            vectorized_y = data.pop('vectorized_y', "Not found")

                            # Create traces for each entry in the np array as bar plots
                            traces = []
                            for index, array in enumerate(vectorized_x):
                                trace = go.Bar(
                                    y=array,
                                    name=f'Trial {index+1}',
                                    text=array,  # Add text labels equal to y-values
                                    textposition='outside',  # Position text labels outside the bars
                                )
                                traces.append(trace)

                            # Create subplots
                            fig = make_subplots(rows=1, cols=1)

                            # Add traces to subplot
                            for trace in traces:
                                fig.add_trace(trace, row=1, col=1)

                            # Set all traces to be invisible initially
                            for i in range(len(traces)):
                                fig.data[i].visible = False

                            # Create buttons for the dropdown menu to switch between plots
                            buttons = []

                            # Button for showing each plot
                            for i, trace in enumerate(traces):
                                button = dict(
                                    label=f'Trial {i+1}',
                                    method="update",
                                    args=[{"visible": [j == i for j in range(len(traces))]},
                                        {"title": f"Vectorized Trial {i} - Score on GPR: {vectorized_y[i]}"}])
                                buttons.append(button)

                            # Button to show all plots
                            buttons.append(dict(
                                label='Show All',
                                method="update",
                                args=[{"visible": [True] * len(traces)},
                                    {"title": "All Trials"}])
                            )

                            # Update the layout with the dropdown menu
                            fig.update_layout(
                                updatemenus=[dict(
                                    active=-1,
                                    buttons=buttons,
                                    x=1.0,
                                    xanchor='left',
                                    y=0.8,
                                    yanchor='top'
                                )],
                                title='Select a Trial to Display its Vectorized Hyperparameters'
                            )
                            
                            data["vectorized"] = fig.to_json()
                            
                            array = data["optimal_x"]

                            # Create a bar chart
                            trace = go.Bar(
                                y=array,
                                text=array,
                                textposition='outside'
                            )

                            # Define the layout
                            layout = go.Layout(
                                margin=go.layout.Margin(
                                l=50,  # left margin
                                r=50,  # right margin
                                b=50,  # bottom margin
                                t=100,  # top margin, increase this to give more space for modebar
                                pad=4   # padding between plot area and the edges of the 'paper'
                                ),
                                title='Vectorized Optimal Hyperparameters',
                                yaxis=dict(title='Value'),
                                
                            )

                            # Create the figure with the trace
                            fig2 = go.Figure(data=[trace], layout=layout)
                            
                            data["optimal"] = fig2.to_json()


                        self.json_package[data["trial_id"]] = data

                    except Exception as e:
                        print(e)

                return self.json_package 

            
        except Exception as e:
            print("Error here")
            print(e)


# Define a Flask-RESTful resource for closing the app
@app.route('/close_app', methods=['GET'])
def close_app():
    os.kill(os.getpid(), 9)
    sys.exit()

# Add resources to the API with their respective endpoints
api.add_resource(GetImageResource, '/get_image/<path:image_path>/<image_name>')
api.add_resource(GetFinalImageResource, '/get_final_image/<path:image_type>')
api.add_resource(UpdateDataResource, '/update_data')
api.add_resource(UpdateEvaluationResource, '/update_evaluation')
api.add_resource(ExploreFeatures, '/load_data/')
api.add_resource(ExplorePreprocessing, '/explore_preprocessing/') 
api.add_resource(ExploreTuner, '/explore_tuner/') 
api.add_resource(SendInitialInfo, '/pre_information')


@socketio.on('connect')
def handle_connect():
    print("Websocket connected")

if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=8082, debug=True , use_reloader=False)
# , use_reloader=False