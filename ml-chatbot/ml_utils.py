from ml_utils import extract_input, extract_language

def extract_input(X):
    return X['input']

def extract_language(X):
    return X[['language']]
