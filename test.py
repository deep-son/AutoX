import pandas as pd
import tensorflow as tf
from app_runner import Wrappers

TRAIN_DATA_URL = "https://storage.googleapis.com/tf-datasets/titanic/train.csv"
TEST_DATA_URL = "https://storage.googleapis.com/tf-datasets/titanic/eval.csv"

train_file_path = tf.keras.utils.get_file("train.csv", TRAIN_DATA_URL)
test_file_path = tf.keras.utils.get_file("eval.csv", TEST_DATA_URL)


if __name__ == '__main__':
    cls_obj = Wrappers()
    cls_obj.StructuredDataClassifier(overwrite=True, max_trials=5)
    cls_obj.sdc_fit(
        # The path to the train.csv file.
        train_file_path,
        # The name of the label column.
        "survived",
        epochs=10,
    )