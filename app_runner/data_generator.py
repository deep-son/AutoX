import os
import sqlite3
import time
from keras.utils import vis_utils
from keras.models import Sequential
from keras.layers import Dense
import json
import threading
from model import ModelGenerator

class DataGenerator:
    def __init__(self):
        # self.max_trials = max_trials
        # self.stop_thread = stop_thread
        self.model_generator = ModelGenerator()

    # def generate_data(self):
    #     latest_trial_path = {}
    #     dir_path = "./structured_data_classifier"
    #     db_folder_path = "D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\app_runner"
    #     db_path = os.path.join(db_folder_path, 'paths.db')
    #     max_trial = self.max_trials
    #      #TODO: Condider cases with max_trials > 10
    #     folders_to_check = [f"trial_{i}" if max_trial<=9 else f"trial_0{i}" for i in range(max_trial) ]

    #     conn = sqlite3.connect(db_path)
    #     cursor = conn.cursor()

    #     while not self.stop_thread:
    #         items_in_parent = os.listdir(dir_path)
    #         for folder in folders_to_check:
    #             if folder in items_in_parent:
    #                 folder_path = os.path.join(dir_path, folder)
    #                 mid_files = os.listdir(folder_path)
    #                 for mid_file in mid_files:
    #                     if 'mid' in mid_file:
    #                         mid_file_path = os.path.join(folder_path, mid_file)
    #                         if folder in latest_trial_path:
    #                             current = latest_trial_path[folder]
    #                             curr_ts = current.split("mid")[-1].split(".")[0]
    #                             new_ts = mid_file_path.split("mid")[-1].split(".")[0]
    #                             if new_ts > curr_ts:
    #                                 latest_trial_path[folder] = mid_file_path
    #                         else:
    #                             latest_trial_path[folder] = mid_file_path

    #         for folder, mid_path in latest_trial_path.items():
    #             # Call your create_model_architecture method here
    #             self.model_generator.create_model_architecture(mid_path)
    #             try:
    #                 insert_query = '''
    #                     INSERT OR REPLACE INTO trials (trial, path) 
    #                     VALUES (?, ?)
    #                 '''
    #                 cursor.execute(insert_query, (folder, mid_path))
    #                 conn.commit()
    #             except sqlite3.Error as e:
    #                 print("An error occurred:", e)

    #         time.sleep(1)

    # def start_the_thread(self):
    #     function_thread = threading.Thread(target=self.generate_data)
    #     function_thread.daemon = True  
    #     function_thread.start()
    
    # def stop_the_thread(self):
    #     self.start_thread = True

    def generate_architecture(self, filepath):
        self.model_generator.create_model_architecture(filepath)


