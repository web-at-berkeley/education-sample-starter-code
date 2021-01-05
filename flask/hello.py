from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route('/hello/')
@app.route('/hello/<name>')
def hello_stranger(name=None):
    return render_template('hello.html', name=name)

@app.route("/my/secret/page")
def secret():
    return "Shh!"

@app.route("/user/<username>")
def user_page(username):
    return f"Welcome, {username}!"

@app.route("/blog/post/<int:post_id>")
def show_post(post_id):
    return f"This is the page for post # {post_id}"