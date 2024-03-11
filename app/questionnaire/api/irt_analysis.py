import pandas as pd
import rpy2.robjects as robjects
from rpy2.robjects.packages import importr
from rpy2.robjects import pandas2ri
import json


#  INFORMATION: INSTALL MIRT
mirt = importr('mirt')

def get_topic_difficulties(student_data):
    pd_df = pd.DataFrame(student_data)
    r_from_pd_df = None
    with (robjects.default_converter + pandas2ri.converter).context():
        r_from_pd_df = robjects.conversion.get_conversion().py2rpy(pd_df)

    # print(r_from_pd_df)

    model = mirt.mirt(r_from_pd_df, model="F1 = 1-3", itemtype="2PL", est="ML", verbose = False)
   
    robjects.r.assign("model", model)

    r_code = """
    library(mirt)

    params <- coef(model, IRTpars = TRUE, simplify = TRUE)
    rounded_params <- data.frame(round(params$items, 2))
    """

    robjects.r(r_code)
    rounded_params = pandas2ri.rpy2py(robjects.r['rounded_params'])
    # print(rounded_params)
    json_data = rounded_params.to_json(orient='records')
    print(json_data)

if __name__ == '__main__':
    import sys
    student_data = json.loads(sys.argv[1])
    result = get_topic_difficulties(student_data)

# student_data = {
#     'A': [1, 0, 1, 1, 0, 1, 0],
#     'B': [0, 1, 1, 1, None, None, None],
#     'C': [0, 0, 1, 1, 0, 1, None]
#     # ... add other categories
# }

get_topic_difficulties(student_data)
