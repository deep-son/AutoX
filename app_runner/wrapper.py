import autokeras as ak
import tensorflow as tf

from app_runner.app_runners import AppRunner, SQLDBRunner
from app_runner.data_generator import DataGenerator

class Wrappers:
    def __init__(self):
        self.stop_thread = False
        self.app_obj = AppRunner()
        self.sql_obj = SQLDBRunner()
                                
    def StructuredDataClassifier(self, *args, **kwargs):
        self.app_obj.start_flask_app()
        self.sql_obj.start_sqldb()
        self.clk = ak.StructuredDataClassifier(*args, **kwargs)
        self.max_trials = kwargs['max_trials']
    
    def sdc_fit(self, *args, **kwargs):
        self.data_generator = DataGenerator(self.max_trials,self.stop_thread)
        self.data_generator.start_the_thread()
        fit_ret = self.clk.fit(*args, **kwargs)
        self.data_generator.stop_the_thread()
        # self.app_obj.stop_flask_app()

        return fit_ret
        
    def sdc_predict(self, *args, **kwargs):
        return self.clk.predict(*args, **kwargs)

    def sdc_evaluate(self, *args, **kwargs):
        return self.clk.evaluate(*args, **kwargs)



