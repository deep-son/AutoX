import autokeras as ak
import tensorflow as tf
from keras.utils import vis_utils
import json
import requests
import time

from app_runner.app_runners import AppRunner, SQLDBRunner, FileSearchRunner
from app_runner.model import ModelGenerator

class Wrappers:
    def __init__(self):
        self.app_obj = AppRunner()
        self.model_obj = ModelGenerator()
        self.file_obj = FileSearchRunner()
        self.app_obj.start_flask_app()
        print("App ready and running...")
                                
    def StructuredDataClassifier(self, *args, **kwargs):
        
        # self.sql_obj.start_sqldb()
        self.file_obj.start_fileSearch()
        time.sleep(5)
        self.clk = ak.StructuredDataClassifier(*args, **kwargs)
        self.max_trials = kwargs['max_trials']
    
    def sdc_fit(self, *args, **kwargs):
        # self.data_generator = DataGenerator(self.max_trials, False)
        # self.data_generator.start_the_thread()
        fit_ret = self.clk.fit(*args, **kwargs)
        # self.data_generator.stop_the_thread()
        self.model_obj.generate_final_architecture_dense(self.clk.export_model())
        
        # self.app_obj.stop_flask_app()

        return fit_ret
        
    def sdc_predict(self, *args, **kwargs):
        return self.clk.predict(*args, **kwargs)

    def sdc_evaluate(self, *args, **kwargs):
        return self.clk.evaluate(*args, **kwargs)



