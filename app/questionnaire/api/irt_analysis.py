import pandas as pd
import json
import girth as irt
import numpy as np

# if __name__ == '__main__':
#     import sys
#     irt_data_json = sys.argv[1]
#     result = irt.onepl_jml(irt_data_json)
#     print(json.dumps(result))

# Parameters for the dataset
num_items = 10
num_participants = 5
#
# # Generate random responses (True for correct, False for incorrect)
#data = np.random.choice([False, False], size=(num_items, num_participants))
#

data = ([[False, False, False, False, False],
 [False, False, False, False, False],
 [False, False, False, False, False],
 [False, False, False, False, False],
 [False, False, False, False, False],
 [False, False, False, False, False],
 [False, False, False, False, False],
 [False, False, False, False, False],
 [False, False, False, False, False],
 [False, False, False, False, False],]

print(data)

print(irt.twopl_jml(data, options=None))
