from flask import Flask
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'

db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)

    def __init__(self, content):
        self.content = content

    def __repr__(self):
        return '<TODO ID: {}. Content: {}. >'.format(self.id, self.content)


@app.route("/")
def weclome():
    return jsonify("Welcome to TODO App.")

@app.route("/todo/list")
def getAllTodos():
    todoList = Todo.query.all()
    todoContent = [(todo.id, todo.content) for todo in todoList]
    return jsonify(todoContent)

@app.route("/todo/<todo_id>")
def getSingleTodo(todo_id):
    singleTodo = Todo.query.filter_by(id=todo_id).first()
    return jsonify([(singleTodo.id, singleTodo.content)])

# NOTE: This is not how you usually pass down a paragraph of text. 
#       Usually, we should put the todo_content inside the body
#       of the request. For the sake of this course, we will put 
#       the todo_content in the request url.
@app.route("/todo/create/<todo_content>")
def createTodo(todo_content):
    newTodo = Todo(todo_content)
    db.session.add(newTodo)
    db.session.commit()
    return jsonify({
        newTodo.id: todo_content
    })

@app.route("/todo/delete/<todo_id>")
def deleteTodo(todo_id):
    singleTodo = Todo.query.filter_by(id=todo_id).first()
    db.session.delete(singleTodo)
    db.session.commit()
    return jsonify({
        todo_id: "Deleted"
    })

@app.route("/todo/update/<todo_id>/<todo_content>")
def updateTodo(todo_id, todo_content):
    singleTodo = Todo.query.filter_by(id=todo_id).first()
    singleTodo.content = todo_content
    db.session.commit()
    return jsonify({
        todo_id: todo_content
    })

if __name__ == '__main__':
    app.run(debug=True)