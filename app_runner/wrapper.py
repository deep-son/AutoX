import autokeras as ak
import tensorflow as tf
import time
import requests
import pandas as pd
import logging
from datetime import datetime

from app_runner.app_runners import AppRunner, FileSearchRunner
from app_runner.model import ModelGenerator
from app_runner.plots import Evaluation, Dataset
from app_runner.utils import APIs


log_format = '%(asctime)s [%(levelname)s] - %(message)s'
logging.basicConfig(filename='wrapper.log', level=logging.DEBUG, format=log_format)

class Wrappers:
    def __init__(self, debug = False):
        """
        Initialize Wrapper Objects.

        Args:
            debug (bool, optional): Debug mode. Defaults to False.
        """
        self.app_obj = AppRunner()
        self.model_obj = ModelGenerator()
        self.file_obj = FileSearchRunner()
        self.evalutaion_obj = Evaluation()
        self.api = APIs()
        
        # self.app_obj.start_flask_app()
        # if debug:
        #     if self.app_obj.check_if_started(port=8082):
        #         print("App is runnning on port 8082")

    def send_pre_information(self):
        """
        Send Pre-Information to the API.
        """
        self.set_pre_information(start_time =  datetime.now().strftime("%H:%M:%S"))
        # self.pre_information["dataset_figure"] = Dataset().generate_dataset_distribution(self.pre_information["x"])
        self.api.publish_data(self.pre_information, "pre_information")
    
    def set_pre_information(self, *args, **kwargs):
        """
        Set Pre-Information about the trial.

        Args:
            *args: Positional arguments.
            **kwargs: Keyword arguments.
        """
        for key, value in kwargs.items():
            self.pre_information[key] = value
        
    def StructuredDataClassifier(self, *args, **kwargs):
        """
        Initialize a StructuredDataClassifier.

        Args:
            *args: Positional arguments.
            **kwargs: Keyword arguments.
        """
        self.pre_information = {}
        self.file_obj.start_fileSearch()
        time.sleep(5)
        self.clk = ak.StructuredDataClassifier(*args, **kwargs)
        self.set_pre_information(task = "Structured_Data_Classifier", max_trials = kwargs['max_trials'], project_name = self.clk.project_name)
        
    
    def sdc_fit(self, *args, **kwargs):
        """
        Fit the StructuredDataClassifier.

        Args:
            *args: Positional arguments.
            **kwargs: Keyword arguments.

        Returns:
            The result of the fit operation.
        """
        self.evaluation_data_path = kwargs.pop('evaluation', None)
        if self.evaluation_data_path == None:
            raise(
                "Please also provide evaluation/test data"
            )
        self.set_pre_information(x = kwargs['x'], y = kwargs['y'])
        self.send_pre_information()

        # self.x_train = pd.read_csv(kwargs['x'])
        # self.x_train.to_csv('D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier\\x_train.csv', index=False)
        # self.y_label = kwargs['y']

        fit_ret = self.clk.fit(*args, **kwargs)
        self.generate_model_architectures()
        self.evaluation_metrics()

        return fit_ret

    def generate_model_architectures(self):
        """
        Generates architecture PNGs

        """
        self.model_obj.generate_final_architecture(self.clk.export_model(), self.pre_information['project_name'])

    def evaluation_metrics(self):
        """
        Compute evaluation metrics.

        """
        x_test = pd.read_csv(self.evaluation_data_path)
        y_test = x_test.pop(self.pre_information['y'])
        y_pred = self.sdc_predict(x_test)
        evaluation_plots = Evaluation().generate_evaluation_plots(y_test, y_pred)
        self.api.publish_data(evaluation_plots, "update_evaluation")

    def sdc_evaluate(self, *args, **kwargs):
        return self.clk.evaluate(*args, **kwargs)
    
    def sdc_predict(self, *args, **kwargs):
        return self.clk.predict(*args, **kwargs)



