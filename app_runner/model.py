import os
from keras.utils import vis_utils
from tensorflow.keras.models import Model
import json
import pygraphviz as pgv


class ModelGenerator:
    def __init__(self):
        pass
    
    def create_model_architecture(self, mid_path):
        try:
            with open(mid_path, 'r') as f:
                json_data = f.read() 
                data = json.loads(json_data)

            graph = pgv.AGraph(directed=True)
            # Set the direction of the graph to left to right (horizontal alignment)
            graph.graph_attr['rankdir'] = 'LR'

            values = data['hyperparameters']['values']  
            input_layer = {"normalize": values["structured_data_block_1/normalize"]}
            dense_layers = {"batch_norm" : values["structured_data_block_1/dense_block_1/use_batchnorm"] , "dropout": values["structured_data_block_1/dense_block_1/dropout"] }
            output_layer = {"dropout": values["classification_head_1/dropout"]}
            num_layers = values["structured_data_block_1/dense_block_1/num_layers"]

            layers = {"Input": f"Input Layer \nstructured_data_block \nNormalize: {input_layer.get('normalize', False)}"}

            layer_units = []
            for i in range(num_layers):
                layer_units.append(values[f"structured_data_block_1/dense_block_1/units_{i}"])

            for index, units in enumerate(layer_units):
                layers[f"Dense_{index+1}"] = f"Dense_{index+1} \nUnits: {units} \nBatch_normalization: {dense_layers.get('batch_norm')} \nDropout: {dense_layers.get('dropout')}"

            layers["Output"] = f"Output Layer \nclassification_head\nDropout: {output_layer.get('dropout', 0.0)}"


            # Add nodes (representing layers) to the graph with rectangle shape, additional text, and custom node sizes
            for layer, text in layers.items():
                # Set the node width and height for the layers
                graph.add_node(layer, label=text, shape='rect', width=2.0, height=0.5)

            # Define connections between layers
            connections = [(node, next_node) for node, next_node in zip(layers.keys(), list(layers.keys())[1:])]

            # Add edges (representing connections) to the graph
            for connection in connections:
                graph.add_edge(*connection)
            
            graph.layout(prog="dot")
            graph.draw("neural_network_sized_nodes.png")
            model_path = os.path.join(os.path.dirname(mid_path), "model.png")
            graph.draw(model_path)

            return True, model_path
        
        except Exception as e:
            print("Cannot find it")
            return False, None
            
    def seperate_model_index(self,model):
        layer_names = [layer.name for layer in model.layers]
        for index, name in enumerate(layer_names):
            if 'dense' in name:
                return index - 1
            
    def generate_final_architecture(self, model, project_name):
        current_directory = os.path.dirname(os.path.abspath(__file__))
        project_directory = os.path.dirname(current_directory)
        project_dir = os.path.join(project_directory, project_name )
        if not os.path.exists(project_dir):
            raise FileNotFoundError(f"The path '{project_dir}' does not exist.")
        else:
            pass
        index = self.seperate_model_index(model)
        vis_utils.plot_model(model, to_file=os.path.join(project_dir, "test_model.png"), show_shapes=True, show_layer_names=True,rankdir='LR', expand_nested=True, show_layer_activations=True)
        preprocessing_model = Model(inputs=model.input, outputs=model.layers[index].output) 
        vis_utils.plot_model(preprocessing_model, to_file=os.path.join(project_dir, "preprocessing_model.png"), show_shapes=True, show_layer_names=True,rankdir='LR', expand_nested=True, show_layer_activations=True)
        dense_model = Model(inputs=model.layers[index+1].input, outputs=model.output) 
        vis_utils.plot_model(dense_model, to_file=os.path.join(project_dir, "dense_model.png"), show_shapes=True, show_layer_names=True,rankdir='LR', expand_nested=True, show_layer_activations=True)
