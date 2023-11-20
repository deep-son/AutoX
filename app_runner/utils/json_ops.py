import json 
import os

class FileNotFound(Exception):
    pass

def read_json(filename):
    try:
        with open(filename, 'r') as file:
            data = json.load(file)
        return data
    except FileNotFoundError as e:
        raise FileNotFound(f"File '{filename}' not found.") from e

def write_json(data, filename):
    try:
        with open(filename, 'w') as file:
            json.dump(data, file, indent=4)
        return True
    except (IOError, OSError) as e:
        print(f"Error writing to the file: {e}")
        return False