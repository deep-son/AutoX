import sys
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import pandas as pd
import numpy as np
from functools import partial
import autokeras as ak
import logging
import networkx as nx
import plotly.graph_objects as go
import json
from flask import Flask, request, render_template, send_file
from flask_socketio import SocketIO
from flask_restful import Api, Resource
import plotly.graph_objects as go
from tensorflow.keras.models import load_model
from tensorflow.keras.models import Model
from alibi.explainers import IntegratedGradients
from alibi.explainers import ALE, plot_ale

app = Flask(__name__)
socketio = SocketIO(app)
api = Api(app)

log_format = '%(asctime)s [%(levelname)s] - %(message)s'
logging.basicConfig(filename='app.log', level=logging.DEBUG, format=log_format)

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

class UpdateEvaluationResource(Resource):
    def post(self):
        args = request.get_json()
        socketio.emit('evaluation',args)

class ExploreModelIG(Resource):
    
    def seperate_model_index(self,model):
        layer_names = [layer.name for layer in model.layers]
        for index, name in enumerate(layer_names):
            if 'dense' in name:
                return index - 1

           
    def plot_importance(self,feat_imp, feat_names):
        """
        Create a horizontal bar chart of feature effects, sorted by their magnitude.
        """
        # Sort feature importance and feature names

        df = pd.DataFrame(data=feat_imp, columns=feat_names).sort_values(by=0, axis='columns')
        feat_imp, feat_names = df.values[0], df.columns

        # Create a horizontal bar chart
        fig = go.Figure(go.Bar(
            x=feat_imp,
            y=feat_names,
            orientation='h',
        ))

        # Customize the layout
        fig.update_layout(
            title=f'What does each feature contribute to the model prediction?',
            xaxis_title=f'Feature effects for class XYZ',
            yaxis=dict(tickfont=dict(size=15)),
            xaxis=dict(titlefont=dict(size=15)),
            title_font=dict(size=18),
            height=500,  # Adjust the height as needed
            width=800,   # Adjust the width as needed
        )

        return fig
    
    def post(self):
        try:
            model = load_model('D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier\\best_model', custom_objects=ak.CUSTOM_OBJECTS)

            index = self.seperate_model_index(model) 
            preprocessing_model = Model(inputs=model.input, outputs=model.layers[index].output)
            dense_model = Model(inputs=model.layers[index+1].input, outputs=model.output) 
            
            x_train = pd.read_csv('D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier\\x_train.csv')
            x_train = x_train.drop(["survived"], axis=1)

            input_data = np.array(x_train.iloc[1,:]).tolist()
            explain_data = np.array(x_train.iloc[1,:])


            output = preprocessing_model.predict(input_data)
            

            def round_value(x):
                return np.where(x>0.5,1.0,0.0)[0]


            target_fn = partial(round_value)
            
            ig  = IntegratedGradients(dense_model, n_steps=100, target_fn=target_fn )

            explanation = ig.explain(output)
            attributions = explanation.data['attributions'][0]
            # Print or analyze the attribution scores as needed
            print(attributions)

            figure = self.plot_importance(attributions, x_train.columns)

            chart_json = figure.to_json()

            return chart_json
        
        except Exception as e:
            print("Error here")
            print(e)

class ExploreModelALE(Resource):
    
    def seperate_model_index(self,model):
        layer_names = [layer.name for layer in model.layers]
        for index, name in enumerate(layer_names):
            if 'dense' in name:
                return index - 1
    
    def post(self):
        try:
            model = load_model('D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier\\best_model', custom_objects=ak.CUSTOM_OBJECTS)

            index = self.seperate_model_index(model) 
            preprocessing_model = Model(inputs=model.input, outputs=model.layers[index].output)
            dense_model = Model(inputs=model.layers[index+1].input, outputs=model.output) 
            
            x_train = pd.read_csv('D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier\\x_train.csv')
            x_train = x_train.drop(["survived"], axis=1)

            input_data = np.array(x_train.iloc[1,:]).tolist()
            explain_data = np.array(x_train.iloc[1,:])

            output = preprocessing_model.predict(input_data)
            
            def pred(x):
                predictions = dense_model.predict(x)
                final_predictions = (predictions > 0.5).astype(int)
                return final_predictions

            # Model is a binary classifier so we only take the first model output corresponding to "good" class probability.
            ale = ALE(pred, feature_names=x_train.columns)
            exp = ale.explain(output)

            figure = self.plot_ale(exp, x_train.columns)

            chart_json = figure.to_json()

            return chart_json
        
        except Exception as e:
            print("Error here")
            print(e)

class ExplorePipeline(Resource):

    def __init__(self):
        self.json_package = {}
    
    def post(self):
        try:
            # Specify the directory where your JSON files are located
            directory_path = "D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier"

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
                for file_name in decision_factors_files:
                    file_path = os.path.join(directory_path, file_name)

                    try:
                        with open(file_path, "r") as json_file:
                            data = json.load(json_file)
                            # Process the data from the JSON fil
                            trie_data = data["trie_json"]
                        
                        # Function to add nodes and edges to the graph
                        def add_nodes(graph, node_data, parent=None):
                            for key, value in node_data['children'].items():
                                graph.add_node(key, num_leaves=value['num_leaves'], hp_name=value['hp_name'])
                                if parent is not None:
                                    graph.add_edge(parent, key)
                                add_nodes(graph, value, key)

                        # Create a directed graph
                        G = nx.DiGraph()

                        # Add nodes and edges to the graph
                        add_nodes(G, trie_data)

                        # Define a custom layout with a top-down orientation
                        pos = nx.nx_agraph.graphviz_layout(G, prog="dot", args="-Grankdir=TB")

                        # Create a Plotly figure for the Trie visualization
                        edge_x = []
                        edge_y = []
                        labels = {}
                        for edge in G.edges():
                            x0, y0 = pos[edge[0]]
                            x1, y1 = pos[edge[1]]
                            edge_x.extend([x0, x1, None])
                            edge_y.extend([y0, y1, None])
                        for node in G.nodes(data=True):
                            x, y = pos[node[0]]
                            labels[node[0]] = f"{node[0]}<br>Leaves: {node[1]['num_leaves']}<br>hp_name: {node[1]['hp_name']}"

                        edge_trace = go.Scatter(
                            x=edge_x, y=edge_y,
                            line=dict(width=0.5, color='#888'),
                            hoverinfo='none',
                            mode='lines')

                        node_x = []
                        node_y = []
                        node_colors = []  # Store node colors
                        hp_names = data.get("hp_names", [])
                        for node in pos:
                            x, y = pos[node]
                            node_x.append(x)
                            node_y.append(y)
                            # Check if hp_name is similar to any hp_name in hp_names
                            if node in data["hp_names"][0]:
                                node_colors.append("red")  # Color the node red
                            else:
                                node_colors.append("lightblue")  # Default color

                        node_trace = go.Scatter(
                            x=node_x, y=node_y,
                            mode='markers+text',
                            text=list(labels.values()),
                            textposition="bottom center",  # Shift labels below the nodes
                            marker=dict(
                                showscale=False,
                                size=20,
                                colorbar=dict(
                                    thickness=15,
                                    title='Node Connections',
                                    xanchor='left',
                                    titleside='right'
                                ),
                                color=node_colors  # Set node colors
                            ))

                        fig = go.Figure(data=[edge_trace, node_trace],
                                        layout=go.Layout(
                                            showlegend=False,
                                            hovermode='closest',
                                            margin=dict(b=0, l=0, r=0, t=0),
                                            xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                                            yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                                            height=500,
                                            width=500))

                        # Show the interactive Trie visualization
                        data["plotly_figure"] = fig.to_json()
                        data.pop('trie_json', "Not found")
                        
                        self.json_package[data["trial_id"]] = data
                    except Exception as e:
                        print(e)

                return self.json_package
            
            # explanation for bayesian
            else:
                try:
                    with open("D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\flowchart.json", "r") as json_file:
                        data = json.load(json_file)
                        # Process the data from the JSON file
                        return data

                except Exception as e:
                    print(e)
                
            
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
api.add_resource(ExploreModelIG, '/load_data_ig')
api.add_resource(ExploreModelALE, '/load_data_ale')
api.add_resource(ExplorePipeline, '/explore_pipeline')


@socketio.on('connect')
def handle_connect():
    print("Websocket connected")

if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=8082, debug=True)
