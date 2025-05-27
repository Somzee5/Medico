from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from twilio.rest import Client
import threading
import schedule
import time
import keys
import os
import re
from pdf2image import convert_from_path
import google.generativeai as genai
import pathlib
import textwrap

from IPython.display import display
from IPython.display import Markdown

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))
# import genai
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

GOOGLE_API_KEY='AIzaSyAGYpKQG9RrBrUZpP1Evy3WwnC3oScyp14'
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

data2 = ""
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def send_report():
    global data2 
    os.system(f"tesseract {os.path.join(app.config['UPLOAD_FOLDER'], 'page_1.png')} tesseract-report")  
    with open('tesseract-report.txt', 'r') as file:
        data = file.read()
    data2 = data 

def convert_pdf_to_png(pdf_file):
    images = convert_from_path(pdf_file,poppler_path=r"C:\Program Files\poppler-23.11.0\Library\bin")
    png_files = []
    for i, image in enumerate(images):
        png_file = os.path.join(app.config['UPLOAD_FOLDER'], f'page_{i}.png')
        image.save(png_file, 'PNG')
        png_files.append(png_file)
    return png_files

def convert_pdf_to_png_report(pdf_file):
    images = convert_from_path(pdf_file,poppler_path=r"C:\Program Files\poppler-23.11.0\Library\bin")
    png_files = []
    for i, image in enumerate(images):
        png_file = os.path.join(app.config['UPLOAD_FOLDER'], f'page_1.png')
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
        

    client = Client(keys.account_sid, keys.auth_token)

    message = client.messages.create(
        body=message_body,
        from_=keys.twilio_number,
        to=keys.target_number
    )

    print(message.body)


     

def schedule_task():
    schedule.every().day.at("15:45").do(send_message)
    schedule.every().day.at("15:05").do(send_message)
    
    while True:
        schedule.run_pending()
        time.sleep(1)

scheduler_thread = threading.Thread(target=schedule_task)
scheduler_thread.start()

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
            # send_message(png_files)
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
            send_report()
            # redirect('http://localhost:5173/users/profile/me/analysis')
            # send_message(png_files)
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
# def check():
#     response = model.generate_content("What is the meaning of life?")
#     return response
def gen():
    upload_report()
    send_report()
    prompt = request.args.get('prompt', '')  # Get prompt from query parameter
    response = model.generate_content("Generate same json data format as mentioned [{Test_Name: , Result: ,Normal_Range: ,Explanation: }}] only array of objects and dont mention any ``` and without markdown format also provide explaination of Test_Name in each object in Explanation field and give the result according to ranges the result should not deviate much from ranges in some cases you may update it if deviation of result is too large from normal range"+data2)
    # to_markdown(response.text)
    if not response:
        return jsonify({'error': 'Text is required'}), 400

    try:
        print(response.text)
        return jsonify(response.text)
    except genai.ApiError as e:
        return jsonify({'error': str(e)}), 500
    # generated_data = [
    #     {
    #         "Test_Name": "Test 1",
    #         "Result": "Result 1",
    #         "Normal_Range": "Normal Range 1",
    #         "Explanation": "Explanation 1"
    #     },
    #     {
    #         "Test_Name": "Test 2",
    #         "Result": "Result 2",
    #         "Normal_Range": "Normal Range 2",
    #         "Explanation": "Explanation 2"
    #     },
    #     # Add more data as needed
    # ]

    # Return JSON response
    # return jsonify(generated_data)


if __name__ == "__main__":
    app.run(debug=False, port=8080, host='0.0.0.0')