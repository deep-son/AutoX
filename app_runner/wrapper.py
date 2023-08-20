import pandas as pd
import tensorflow as tf
import autokeras as ak
import multiprocessing
from app_runner.app import run_app


class Wrappers:
    def __init__(self):
        pass
        
    def StructuredDataClassifier(self, *args, **kwargs):
        self.clk = ak.StructuredDataClassifier(*args, **kwargs)
    
    def sdc_fit(self, *args, **kwargs):
        self.start_flask_app()
        self.clk.fit(*args, **kwargs)

    def start_flask_app(self):
        self.flask_process = multiprocessing.Process(target=run_app)
        self.flask_process.start()
        
    def stop_flask_app(self):
        if self.flask_process:
            self.flask_process.terminate()
            self.flask_process.join()




