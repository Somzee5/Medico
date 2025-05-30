# chatbot_model.py
import joblib

# Load trained model and response mapping
model = joblib.load("chatbot_model.joblib")
response_lookup = joblib.load("response_lookup.joblib")

def predict_intent(message: str) -> str:
    intent = model.predict([message])[0]
    return response_lookup.get(intent, "I'm not sure how to respond to that.")
