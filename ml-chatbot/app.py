from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_utils import extract_input, extract_language
import pandas as pd
import joblib
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Load multilingual model and response dictionary
model = joblib.load("chatbot_multilingual_model.joblib")
response_lookup = joblib.load("response_lookup_multilingual.joblib")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        message = data.get("message")
        language = data.get("language", "english").lower()

        if not message:
            return jsonify({"response": "Message is required."}), 400

        # ✅ Prepare input as a DataFrame
        X_input = pd.DataFrame([{"input": message, "language": language}])

        # Predict intent
        intent = model.predict(X_input)[0]

        # Lookup multilingual response
        response = response_lookup.get((language, intent), "I'm not sure how to respond to that.")

        return jsonify({"response": response})

    except Exception as e:
        print("❌ Error during prediction:", traceback.format_exc())
        return jsonify({"response": "Sorry, an error occurred during processing."}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
