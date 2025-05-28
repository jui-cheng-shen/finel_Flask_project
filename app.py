from flask import Flask, request, render_template, flash

app = Flask(__name__)

@app.route('/static/<path:path>')
def static_proxy(path):
    return app.send_static_file(path)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    # 處理表單提交邏輯
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')
    print(f"收到訊息：{name}, {email}, {message}")
    return "訊息已送出！感謝您的聯繫。"

@app.route('/achievements')
def achievements():
    return render_template('achievements.html')

@app.route('/photos')
def photos():
    return render_template('photos.html')




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)