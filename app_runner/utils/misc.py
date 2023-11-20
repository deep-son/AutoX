import autokeras as ak
from tensorflow.keras.models import load_model

class FileNotFound(Exception):
    pass

def get_best_model(filename):
    try:
        model = load_model('D:\\Courses\\Master_Thesis\\automl_exp\\MT_Code\\structured_data_classifier\\best_model', custom_objects=ak.CUSTOM_OBJECTS)
        return model
    except FileNotFoundError as e:
        raise FileNotFound(f"File '{filename}' not found.") from e
