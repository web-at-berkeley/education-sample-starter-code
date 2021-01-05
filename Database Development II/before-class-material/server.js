const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

const url = 'mongodb://127.0.0.1:27017/database-tutorial-2'

mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

const Schema = mongoose.Schema

// name, age, occupation (PEOPLE)
// {
//   name: asdasd,
//   age: asdsds,
//   occupation: asdasdsd,
// }

const todoSchema = new Schema({
  content: String,
})

const TODO = mongoose.model("TODO", todoSchema)


// The method of the root url. Be friendly and welcome our user :)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the TODO app.' });   
});

// All HTTP methods under the /todos URL.
router.route('/todos')
  // This GET method is in charge of returnning all the todos.
  .get((req, res) => {
    TODO.find().then((todos) => {
      res.json({ message: 'Return all todos.', todos: todos});
    })
  })
  // This POST methods is used to create a new todo. 
  // Its request will have a body, containing the content of the new todo.
	.post((req, res) => {
    const todo = new TODO({
      content: req.body.content
    })
    todo.save((error, document) => {
      res.json({ 
        message: ('Create a new todo: ' + todo._id + " - " + req.body.content),
        todo_id:  todo._id,
        content: req.body.content,
      }); 
    })
  })

// All HTTP methods under the /todos/:todo_id URL.
// The /:todo_id is a parameter within the URL that specifies a particular todo.
router.route('/todos/:todo_id')
  // This GET method is used to get the content from a specific todo.
  .get((req, res) => {
    TODO.findById(req.params.todo_id, (err, todo) => {
      if (err) {
        res.json({ message: 'Error when getting the content of the todo.'});
      }
      res.json({ message: 'Get the content from a todo.', todo});
    })
  })
  // We use PUT method to update a todo's content.
  .put((req, res) => {
    TODO.findByIdAndUpdate(req.params.todo_id, {content: req.body.content}, (err, todo) => {
      if (err) {
        res.json({ message: 'Error when updating todo.'});
      }
      res.json({ message: 'Update the todo: ' + req.params.todo_id, 
                old: todo, 
                new: {_id: req.params.todo_id, content: req.body.content}});
    });
  })
  // DELETE method is used to delete a todo.
  .delete((req, res) => {
    TODO.findByIdAndDelete(req.params.todo_id, (err, todo) => {
      if (err) {
        res.json({ message: 'Error when deleting todo.'});
      }
      res.json({ message: 'Delete the todo: ' + todo._id, todo: {_id: todo._id, content: todo.content}});
    });
  })

app.use('/api', router); // API Root url at: http://localhost:8080/api


app.listen(port);
console.log('Server listenning on port ' + port);