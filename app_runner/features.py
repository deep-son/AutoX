import os
import autokeras as ak
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from tensorflow.keras.models import load_model
from tensorflow.keras.models import Model
from alibi.explainers import IntegratedGradients
from alibi.explainers import ALE


class Features:

    def __init__(self, project_name : 'str', train_file_path: 'str', target_name:'str'):
        self.project_name = project_name
        self.train_file_path = train_file_path
        self.target_name = target_name
        self.x_train =  pd.read_csv(self.train_file_path)
        current_directory = os.path.dirname(os.path.abspath(__file__))
        model_directory = os.path.dirname(current_directory)
        best_model_path = os.path.join(model_directory, self.project_name, 'best_model')
        
        self.get_model(best_model_path)

        
    def get_model(self, best_model_path):
        model = load_model(best_model_path, custom_objects=ak.CUSTOM_OBJECTS)
        self.model = model
        index = self.seperate_model_index(model) 
        self.preprocessing_model = Model(inputs=model.input, outputs=model.layers[index].output)
        self.dense_model = Model(inputs=model.layers[index+1].input, outputs=model.output) 

        

    def seperate_model_index(self, model):
        layer_names = [layer.name for layer in model.layers]
        for index, name in enumerate(layer_names):
            if 'dense' in name:
                return index - 1

    def plot_importance_ig(self, feat_imp, feat_names, predictions):
        """
        Create a figure with multiple horizontal bar charts of feature effects,
        each corresponding to a row in the data, with buttons to switch between them.
        Each plot has its own dynamic x-axis title.
        """
        # Create DataFrame from feature importance and names
        df = pd.DataFrame(data=feat_imp, columns=feat_names)

        print(predictions)
        # Create a figure
        fig = go.Figure()

        # Add a trace for each row in the DataFrame
        for i in range(len(df)):
            fig.add_trace(
                go.Bar(
                    x=df.iloc[i, :].sort_values().values,
                    y=df.iloc[i, :].sort_values().index,
                    orientation='h',
                    visible=(i == 0)  # Only the first trace is visible initially
                )
            )

        # Create annotations for each trace including prediction values
        annotations = []
        for i in range(len(df)):
            prediction_text = f'Prediction: {predictions[i]}' if i < len(predictions) else 'Prediction: N/A'
            annotation = dict(
                xref='paper', 
                yref='paper', 
                x=0.5, 
                y=-0.22, 
                showarrow=False, 
                text=f'Feature effects for Row {i+1} - {prediction_text}',
                font=dict(size=15),
                xanchor='center',
                yanchor='bottom',
                visible=(i == 0)  # Only the first annotation is visible initially
            )
            annotations.append(annotation)

        # Create buttons to switch between traces and annotations
        buttons = []
        for i in range(len(df)):
            visible_traces = [False] * len(df)
            visible_traces[i] = True

            visible_annotations = [False] * len(df)
            visible_annotations[i] = True

            button = dict(
                label=f'Row {i+1}',
                method='update',
                args=[{'visible': visible_traces},
                    {'annotations': [
                        dict(annotation, visible=vis) for annotation, vis in zip(annotations, visible_annotations)
                    ]}]
            )
            buttons.append(button)

        fig.update_layout(
            updatemenus=[{
                'buttons': buttons,
                'direction': 'down',
                'showactive': True,
                'x': 1.0,
                'xanchor': 'left',
                'y': 0.8,
                'yanchor': 'top',
            }],
            title='What does each feature contribute to the model prediction?',
            yaxis=dict(tickfont=dict(size=15)),
            title_font=dict(size=18),
            height=500,  # Adjust the height as needed
            width=800,   # Adjust the width as needed
            annotations=annotations, # Initial set of annotations
            
        )

        return fig

    def plot_values_ale(self, exp):
        y_mains = exp.ale_values
        x_mains = exp.feature_values
        x_additionals = exp.feature_deciles

        feature_names = exp.feature_names

        fig = go.Figure()

        flatten = lambda l: [item for sublist in l for item in sublist]

        for i, (y_main, x_main, x_additional, feature_name) in enumerate(zip(y_mains, x_mains, x_additionals, feature_names)):

            y_main_flat = flatten(y_main.tolist())
            x_main_flat = x_main.tolist()

            y_additional = [min(y_main_flat)] * len(x_additional)

            fig.add_trace(go.Scatter(
                x=x_main_flat, y=y_main_flat, mode='lines+markers',
                name=f'{feature_name} - ale values',
                visible=(i==0),
                line=dict(color='blue'),
                marker=dict(color='blue')
            ))

            fig.add_trace(go.Scatter(
                x=x_additional, y=y_additional, mode='markers',
                name=f'{feature_name} - intervals',
                marker=dict(symbol='line-ns-open', color='red', size=10),
                visible=(i==0)
            ))

        buttons = []

        for i, feature_name in enumerate(feature_names):
            buttons.append(dict(
                method='update',
                label=feature_name,
                args=[{'visible': [i==j//2 for j in range(len(feature_names)*2)]}]  
            ))


        fig.update_layout(
            updatemenus=[dict(
                type='dropdown',
                direction='down',
                x = 1.0,
                xanchor ='left',
                y=0.8,
                yanchor = 'top',
                showactive=True,
                active=0,
                buttons=buttons,
                
            )],
            title_text="ALE Plot by Feature",
            height=500,  
            width=800,
        )

        fig.update_xaxes(title_text='Feature Value')
        fig.update_yaxes(title_text='ALE')

        return fig


class FeatureModels(Features):

    def __init__(self, project_name : 'str', train_file_path: 'str', target_name : 'str'):
        super().__init__(project_name, train_file_path, target_name)

    def plot_integrated_gradients(self, num_rows : int):
        num_classes = len(self.x_train[self.target_name].value_counts())
        x_train = self.x_train.drop([self.target_name], axis=1)
        input_data = np.array(x_train.iloc[1:num_rows,:]).tolist()

        preprocessing_output = self.preprocessing_model.predict(input_data)
        
        def target(x):
            return np.argmax(x, axis=1)
        
        if num_classes>2:
            predictions = self.model(np.array(input_data))
            predictions = np.argmax(predictions,axis=1)
            predictions = predictions.tolist()
            ig  = IntegratedGradients(self.dense_model, target_fn=target ,n_steps=100)
        else:
            flatten = lambda l: [item for sublist in l for item in sublist]
            predictions = self.model(np.array(input_data))
            predictions = (predictions.numpy() > 0.5).astype(int)
            predictions = flatten(predictions.tolist())

            ig  = IntegratedGradients(self.dense_model, n_steps=100)


        explanation = ig.explain(preprocessing_output)
        attributions = explanation.data['attributions'][0]

        figure = self.plot_importance_ig(attributions, x_train.columns, predictions)
        chart_json = figure.to_json()

        return chart_json
        

    def plot_accumulated_local_effects(self):
        x_train = self.x_train.drop([self.target_name], axis=1)
        input_data = np.array(x_train.iloc[:,:]).tolist()
        
        preprocessing_output = self.preprocessing_model.predict(input_data)
        def pred(x):
            predictions = self.dense_model.predict(x)
            return predictions

        ale = ALE(pred, feature_names=x_train.columns)
        exp = ale.explain(preprocessing_output)
        
        figure = self.plot_values_ale(exp)
        chart_json = figure.to_json()
        return chart_json