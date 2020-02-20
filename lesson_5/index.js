const express = require('express');
const mongoose = require('mongoose');
const taskMongoose = require('./mongoBase');
const path = require('path');
const hbs = require("hbs");

mongoose.connect('mongodb://localhost:27017/tasks', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();

app.use('/static', express.static(__dirname))

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'templates/views'));
hbs.registerPartials(path.resolve(__dirname, 'templates/partials'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/tasks', async (req, res) => {
	const tasks = await taskMongoose.find();
	
	res.render('main', {tasks})
})

app.post('/tasks', async (req, res) => {
	const task = new taskMongoose(req.body);
	const taskAfterSave = await task.save();

	res.json(taskAfterSave);
})

app.delete('/tasks', async (req, res) => {
	removedTask = await taskMongoose.deleteOne({title: req.body.title}, async (error, result) => {
		if(error) {
			return console.log(error);	
		} 
	})
	// Ререндер не работает, спросить почему ?
	// const tasks = await taskMongoose.find();
	// res.render('main', {tasks})

	res.json(removedTask);
})

app.put('/tasks', async (req, res) => {
	updateTask = await taskMongoose.updateOne({title: req.body.title}, {isFinished: req.body.isFinished}, (error, result) => {
		if(error) return console.log(error);
	})

	res.json(updateTask);
})

app.listen(3000, () => {
    console.log('Server works on port: 3000');
});
