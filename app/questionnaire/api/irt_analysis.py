import pandas as pd
import json
import girth as irt
import numpy as np


def estimate_irt_parameters(irt_data_json):
    irt_data = json.loads(irt_data_json)
    irt_data_tuples = [(d['studentID'], d['questionID'], d['correctness']) for d in irt_data]
    model = irt(irt_data_tuples)
    model.fit()
    difficulty_params = model.theta
    return difficulty_params.to_dict()

if __name__ == '__main__': 
    sample_irt_data = """
    [
    {"studentID": 1, "questionID": 1, "correctness": 0},
    {"studentID": 2, "questionID": 1, "correctness": 1},
    {"studentID": 1, "questionID": 2, "correctness": 0},
    {"studentID": 3, "questionID": 2, "correctness": 1},
    {"studentID": 2, "questionID": 3, "correctness": 0}
    ]
    """  # Store the JSON as a string

# Parameters for the dataset
num_items = 20  
num_participants = 1000 

# Generate random responses (True for correct, False for incorrect)
data = np.random.choice([True, False], size=(num_items, num_participants))

print(data)

print(irt.onepl_jml(data, options=None))
