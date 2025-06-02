import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, FunctionTransformer
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from ml_utils import extract_input, extract_language

import joblib

# ✅ Step 1: Load multilingual dataset
df = pd.read_csv("chatbot_multilingual_dataset.csv")

# Features and labels
X = df[['input', 'language']]
y = df['intent']

# ✅ Step 3: Preprocessing pipelines
text_pipeline = Pipeline([
    ('selector', FunctionTransformer(extract_input, validate=False)),
    ('tfidf', TfidfVectorizer())
])

lang_pipeline = Pipeline([
    ('selector', FunctionTransformer(extract_language, validate=False)),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

# ✅ Step 4: Combine features
preprocessor = ColumnTransformer([
    ('text', text_pipeline, ['input', 'language']),
    ('lang', lang_pipeline, ['language'])
])

# ✅ Step 5: Model pipeline
model = Pipeline([
    ('features', preprocessor),
    ('classifier', LogisticRegression(max_iter=1000))
])

# ✅ Step 6: Train/Test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ✅ Step 7: Train the model
model.fit(X_train, y_train)

# ✅ Step 8: Save model and responses
joblib.dump(model, "chatbot_multilingual_model.joblib")

response_lookup = df.groupby(['language', 'intent']).first()['response'].to_dict()
joblib.dump(response_lookup, "response_lookup_multilingual.joblib")

print("✅ Model and response lookup saved successfully!")
