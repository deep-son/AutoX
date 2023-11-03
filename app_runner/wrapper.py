import autokeras as ak
import tensorflow as tf
from keras.utils import vis_utils
import time
import requests
import pandas as pd
import logging
from datetime import datetime

from app_runner.app_runners import AppRunner, SQLDBRunner, FileSearchRunner
from app_runner.model import ModelGenerator
from app_runner.plots import Evaluation, Dataset

log_format = '%(asctime)s [%(levelname)s] - %(message)s'
logging.basicConfig(filename='wrapper.log', level=logging.DEBUG, format=log_format)

class Wrappers:
    def __init__(self, debug = False):
        self.app_obj = AppRunner()
        self.model_obj = ModelGenerator()
        self.file_obj = FileSearchRunner()
        self.FLASK_API_URL = "http://127.0.0.1:8082/"
        # self.app_obj.start_flask_app()
        # if debug:
        #     if self.app_obj.check_if_started(port=8082):
        #         print("App is runnning on port 8082")

    def send_pre_information(self):
        self.pre_information["dataset_figure"] = Dataset().generate_dataset_distribution(self.pre_information["x"])
        self.pre_information["start_time"] = datetime.now().strftime("%H:%M:%S")
        self.publish_data(self.pre_information, "pre_information")
        

    def StructuredDataClassifier(self, *args, **kwargs):
        # self.sql_obj.start_sqldb()
        self.file_obj.start_fileSearch()
        time.sleep(5)
        self.clk = ak.StructuredDataClassifier(*args, **kwargs)
        self.max_trials = kwargs['max_trials']
        self.pre_information = {"task" : "Structured_Data_Classifier", "max_trials": self.max_trials}
    
    def sdc_fit(self, *args, **kwargs):
        # self.data_generator = DataGenerator(self.max_trials, False)
        # self.data_generator.start_the_thread()
        
        self.evaluation_data_path = kwargs.pop('evaluation', None)
        if self.evaluation_data_path == None:
            raise(
                "Please also provide evaluation/test data"
            )
        self.pre_information["y"] = kwargs['y']
        self.pre_information["x"] = kwargs['x']
        
        self.send_pre_information()

        self.x_train = pd.read_csv(kwargs['x'])
        self.x_train.to_csv('D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier\\x_train.csv', index=False)
        self.y_label = kwargs['y']

        fit_ret = self.clk.fit(*args, **kwargs)
        self.model_obj.generate_final_architecture(self.clk.export_model())
        
        self.evaluation_metrics()

        return fit_ret
        
    def sdc_predict(self, *args, **kwargs):
        return self.clk.predict(*args, **kwargs)

    def evaluation_metrics(self):
        self.x_test = pd.read_csv(self.evaluation_data_path)
        self.y_test = self.x_test.pop(self.y_label)
        self.y_pred = self.sdc_predict(self.x_test)
        evaluation_plots = Evaluation().generate_evaluation_plots(self.y_test, self.y_pred)

        self.publish_data(evaluation_plots, "update_evaluation")


    def publish_data(self, message_data, api_endpoint): 
        url = self.FLASK_API_URL + api_endpoint
        response = requests.post(url, json=message_data)
        if response.status_code == 200:
            print("Data sent successfully")
        else:
            print(f"Failed to send data: {response.status_code}")

    def sdc_evaluate(self, *args, **kwargs):
        return self.clk.evaluate(*args, **kwargs)



