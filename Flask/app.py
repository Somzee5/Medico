from dotenv import load_dotenv
load_dotenv() # Ensure this is at the very top to load .env variables first

from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from twilio.rest import Client
import os # Make sure os is imported for environment variables
import re
from pdf2image import convert_from_path
import google.generativeai as genai
import pathlib
import textwrap # Still here for safety, though to_markdown was removed

app = Flask(__name__)

# --- CORS Configuration Update ---
# Allow requests only from your local development frontend and your deployed Render frontend
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "https://mediease-frontend-app.onrender.com", "https://medico-imgg.onrender.com"]}})
# --- End CORS Configuration Update ---


UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load Google API Key from environment variables
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

data2 = "" # Global variable, consider passing as argument if possible for better practice

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def send_report():
    global data2
    # Ensure tesseract is installed in the environment for this to work
    os.system(f"tesseract {os.path.join(app.config['UPLOAD_FOLDER'], 'page_1.png')} tesseract-report")
    with open('tesseract-report.txt', 'r') as file:
        data = file.read()
    data2 = data

def convert_pdf_to_png(pdf_file):
    # Removed poppler_path as it's Windows-specific. Render will have poppler-utils installed globally.
    images = convert_from_path(pdf_file)
    png_files = []
    for i, image in enumerate(images):
        png_file = os.path.join(app.config['UPLOAD_FOLDER'], f'page_{i}.png')
        image.save(png_file, 'PNG')
        png_files.append(png_file)
    return png_files

def convert_pdf_to_png_report(pdf_file):
    # Removed poppler_path as it's Windows-specific. Render will have poppler-utils installed globally.
    images = convert_from_path(pdf_file)
    png_files = []
    for i, image in enumerate(images):
        png_file = os.path.join(app.config['UPLOAD_FOLDER'], f'page_1.png') # Overwrites previous page, check logic if multiple pages are needed
        image.save(png_file, 'PNG')
        png_files.append(png_file)

    return png_files

def send_message():
    os.system(f"tesseract {os.path.join(app.config['UPLOAD_FOLDER'], 'page_0.png')} tesseract-result")
    with open('tesseract-result.txt', 'r') as file:
        body = file.read()

    medicine_lines = re.findall(r"Tab\..+", body)
    medicine_lines_str = "\n".join(medicine_lines)

    note_match = re.search(r"Note from your doctor:(.*?)Follow up:", body, re.DOTALL)
    if note_match:
        note = note_match.group(1).strip()
        note = ' '.join(line.strip() for line in note.splitlines())
    else:
        note = ""

    message_body = f"\n{medicine_lines_str}\n\n{'Note from the doctor:' if note else ''}{note}"

    # Load Twilio credentials from environment variables
    twilio_account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    twilio_auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    twilio_number = os.environ.get('TWILIO_NUMBER')
    target_number = os.environ.get('TARGET_NUMBER')

    client = Client(twilio_account_sid, twilio_auth_token)

    message = client.messages.create(
        body=message_body,
        from_=twilio_number,
        to=target_number
    )

    print(message.body)


# Removed the schedule_task function and its thread setup

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return "No file part"
        file = request.files['file']
        if file.filename == '':
            return "No selected file"
        if file and allowed_file(file.filename):
            filename = "upload.pdf"
            pdf_file = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(pdf_file)
            png_files = convert_pdf_to_png(pdf_file)
            return "File uploaded successfully and text extracted."
    return '''
  <!doctype html>
<html>
<head>
  <title>Upload Prescription</title>
</head>
<body style="font-family: sans-serif; margin: 2rem;">
  <div style="text-align: center;">
    <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Upload New File</h1>
    <form method="post" enctype="multipart/form-data">
      <input type="file" name="file" style="border: 1px solid #ccc; padding: 0.5rem 1rem; border-radius: 5px;">
      <input type="submit" value="Upload" style="background-color: #3498db; color: #fff; border: none; padding: 0.8rem 1.5rem; border-radius: 5px; cursor: pointer; font-size: 1rem; margin-left: 1rem;">
    </form>
  </div>
</body>
</html>
    '''

@app.route('/report', methods=['GET', 'POST'])
def upload_report():
    if request.method == 'POST':
        if 'file' not in request.files:
            return "No file part"
        file = request.files['file']
        if file.filename == '':
            return "No selected file"
        if file and allowed_file(file.filename):
            filename = "uploadreport.pdf"
            pdf_file = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(pdf_file)
            png_files = convert_pdf_to_png_report(pdf_file)
            send_report() # Calls send_report after conversion
            # Removed redirect to localhost:5173 as this is a Flask API now.
            return "Report uploaded Successfully. Kindly Check Analysis on Portal"
    return '''
<!DOCTYPE html>
<html>
<head>
  <title>Upload Lab Report</title>
</head>
<body>
  <div class="container" style="background-color: #f2f2f2; padding: 2rem; border-radius: 10px; max-width: 500px; margin: 0 auto;">
    <h1>Upload Lab Report</h1>
    <form method="post" enctype="multipart/form-data" class="upload-form" style="display: flex; flex-direction: column; gap: 1rem;">
      <div class="file-input-container" style="display: flex; flex-direction: column; gap: 0.5rem;">
        <label for="file" style="font-size: 0.875rem; color: #777;">Select Lab Report:</label>
        <input type="file" id="file" name="file" accept=".pdf,.doc,.docx,.txt" required style="border: 1px solid #ccc; padding: 0.5rem 1rem; border-radius: 5px;">
      </div>
      <div class="button-container" style="text-align: center;">
        <button type="submit" class="upload-button" style="background-color: #3498db; color: #fff; border: none; padding: 0.8rem 1.5rem; border-radius: 5px; cursor: pointer; font-size: 1rem; transition: background-color 0.2s ease-in-out;">Upload</button>
      </div>
    </form>
  </div>

  <script>
    // ...
  </script>
</body>
</html>
    '''

@app.route('/gen', methods=['GET', 'POST'])
def gen():
    # Calling upload_report() and send_report() here again might be redundant if this is called after /report
    # Consider if /gen should expect the report to already be processed or if it triggers processing itself.
    # For now, keeping as is, but be aware of potential redundant processing.
    # upload_report() # This would expect a file in the request, which /gen might not have.
    send_report() # This will process the last saved page_1.png

    # Get prompt from query parameter (e.g., /gen?prompt=your_question)
    # The prompt might be better sent in the request body for POST requests.
    prompt = request.args.get('prompt', '')
    
    # Ensure data2 is populated before calling model.generate_content
    # if not data2:
    #     return jsonify({'error': 'No report data available. Please upload a report first.'}), 400

    full_prompt = "Generate same json data format as mentioned [{Test_Name: , Result: ,Normal_Range: ,Explanation: }}] only array of objects and dont mention any ``` and without markdown format also provide explaination of Test_Name in each object in Explanation field and give the result according to ranges the result should not deviate much from ranges in some cases you may update it if deviation of result is too large from normal range" + data2
    response = model.generate_content(full_prompt)

    if not response.text: # Use response.text instead of just response
        return jsonify({'error': 'No content generated from Gemini API'}), 400

    try:
        # Assuming response.text is already a JSON string that can be directly parsed
        # If it's not a valid JSON string, you might need to use json.loads()
        # For now, let's assume it directly returns parsable JSON text
        print(response.text)
        return jsonify(response.text) # Returning a JSON string inside a jsonify()
    except genai.ApiError as e:
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    # In a production environment, gunicorn will run the app.
    # This block is primarily for local development.
    # Ensure UPLOAD_FOLDER exists if running locally.
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=False, port=8080, host='0.0.0.0')