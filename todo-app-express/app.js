const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Use EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Use body-parser for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Sample data for todos
const todos = [];

// Define routes
app.get('/', (req, res) => {
    res.render('index', { todos });
});


// Define routes for adding and deleting todos
app.post('/add', (req, res) => {
    const newTodo = req.body.todo;
    todos.push(newTodo);
    res.redirect('/');
});

app.post('/delete/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (!isNaN(index) && index >= 0 && index < todos.length) {
        todos.splice(index, 1);
    }
    res.redirect('/');
});

app.post('/edit/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const editedTodo = req.body.editedTodo;

    if (!isNaN(index) && index >= 0 && index < todos.length) {
        todos[index] = editedTodo;
    }
    res.redirect('/');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
