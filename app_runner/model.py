import os
from keras.utils import vis_utils
from keras.models import Sequential
from keras.layers import Dense
import json

class ModelGenerator:
    def __init__(self):
        pass

    def create_model(self,layer_units):
        model = Sequential()
        model.add(Dense(units=layer_units[0], input_dim=784))
        layer_units = layer_units[1:]
        for units in layer_units:
            model.add(Dense(units=units))
        
        return model
    
    def create_model_architecture(self, mid_path):
        with open(mid_path, 'r') as f:
            json_data = f.read() 
            data = json.loads(json_data)

        values = data['hyperparameters']['values']   
        num_layers = values["structured_data_block_1/dense_block_1/num_layers"]
        layer_units = []
        for i in range(num_layers):
            layer_units.append(values[f"structured_data_block_1/dense_block_1/units_{i}"])
        
        model = self.create_model(layer_units)
        # Visualize the model architecture
        model_path = os.path.join(os.path.dirname(mid_path), "model.png")
        vis_utils.plot_model(model, to_file=model_path, show_shapes=True, show_layer_names=True,rankdir='LR', expand_nested=True, show_layer_activations=True )