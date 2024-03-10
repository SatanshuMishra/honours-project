import numpy as np
import rpy2.robjects as robjects
from rpy2.robjects.packages import importr

mirt = importr('mirt')

#  INFORMATION: THIS FUNCTION EXTRACTS UNIQUE TOPIC NAMES
def get_unique_topics(student_data): 
    return list(set(student['questionTopic'] for student in student_data))

#  INFORMATION: THIS FUNCTION EXTRACTS UNIQUE TAXONOMY CATEGORIES
def get_unique_question_types(topic_data):
    """Extract unique question types for a specific topic."""
    return list(set(student['taxonomyCategory'] for student in topic_data))

#  INFORMATION: THIS FUNCTION HANDLES MISSING DATA THROUGH PADDING
def handle_missing_data(student_question_matrix):
    """Pad missing data with NAs""" 
    for row_idx, student_attempts in enumerate(student_question_matrix):
        missing_attempts = np.isnan(student_attempts)  # Find True for missing values
        if np.any(missing_attempts):  # If any missing values exist
            student_question_matrix[row_idx, missing_attempts] = np.nan

    student_question_matrix[np.isnan(student_question_matrix)] = "Missing"  # Replace with your preferred placeholder

    student_question_matrix = student_question_matrix.astype(str)
    return student_question_matrix


def get_topic_difficulties(student_data):
    topic_difficulties = {}

    unique_topics = get_unique_topics(student_data)

    print("UNIQUE TOPICS: ", unique_topics)

    for topic in unique_topics:
        #  INFO: EXTRACT DATA SET FOR EACH INDEPENDENT TOPIC

        topic_data = [student for student in student_data if student['questionTopic'] == topic]

        print("TOPIC DATA: ", topic_data)

        question_types = get_unique_question_types(topic_data)

        print("UNIQUE TAXONOMY TYPES: ", question_types)

        # Create student x question matrix 
        student_question_matrix = np.empty((len(topic_data), len(question_types)))
        student_question_matrix[:] = np.nan

        print("1. MATRIX: ", student_question_matrix)

        for student_idx, student in enumerate(topic_data):
            for type_idx, question_type in enumerate(question_types):
                attempts = [attempt for attempt in student['attemptHistory'] if student['taxonomyCategory'] == question_type]
                if attempts:  # If the student has attempts for this question type
                    student_question_matrix[student_idx, type_idx] = attempts[0]  # Use the first attempt 

        # Fit IRT model (Example with padding, other missing data strategies possible)
        student_question_matrix = handle_missing_data(student_question_matrix)  # Implement missing data  handling (like padding)

        r_vector = robjects.FloatVector(student_question_matrix.flatten())  # Flatten to a vector
        r_matrix = robjects.r['matrix'](r_vector, nrow=len(topic_data), ncol=len(question_types)) 

        # Reshape into a NumPy array (assuming mirt works better with this)
        r_array = np.array(r_matrix).reshape(len(topic_data), len(question_types))

        print(r_array.tolist())

        # Now use r_array with mirt
        model = mirt.mirt(r_array.tolist(), 1, model="2PL", est="ML")  # Replace with r_array
        
        coefficients = mirt.coef(model)
        difficulties = coefficients[1]

        # Store difficulties 
        topic_difficulties[topic] = {type: difficulties[0] for type in question_types}

    return topic_difficulties


student_data = [
    {
        'student_id': 1,
        'questionTopic': 'Algebra',
        'taxonomyCategory': 'Understanding',
        'attemptHistory': [1, 0, 1]  # Attempts for different questions within 'Understanding'
    },
    {
        'student_id': 1,
        'questionTopic': 'Algebra',
        'taxonomyCategory': 'Evaluation',
        'attemptHistory': [1, 0, 1, 0, 1]  # Attempts for different questions within 'Understanding'
    },
    {
        'student_id': 1, 
        'questionTopic': 'Geometry',
        'taxonomyCategory': 'Triangles',
        'attemptHistory': [1, 1, 0, 1]
    },
    {
        'student_id': 1,
        'questionTopic': 'Geometry',
        'taxonomyCategory': 'Evaluation',
        'attemptHistory': [1, 0, 1, 1, 1]  # Attempts for different questions within 'Understanding'
    },

    # ... more student data
]


# Example usage
topic_difficulties = get_topic_difficulties(student_data)
print(topic_difficulties)
