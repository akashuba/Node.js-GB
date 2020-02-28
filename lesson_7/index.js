const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const taskMongoose = require('./model/mongoBase');
const userMongoose = require('./model/user');

mongoose.connect('mongodb://localhost:27017/tasks', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const app = express();

app.use(express.json());
app.use(cors());

//Middleware for Auth
const checkAuth = (req, res, next) => {
	//Bearer <token>

	if (req.headers.authorization) {
		const [type, token] = req.headers.authorization.split(' ');

		//Валидация токена
		jwt.verify(token, 'Very secret code', (err, decoded) => {
			if (err) {
				return res.status(403).send();
			}

			req.user = decoded;
			next();
		});
	} else {
		return res.status(403).send();
	}
};

app.use('/tasks', checkAuth);

app.get('/', (req, res) => {
	res.redirect('/tasks')
})

app.get('/tasks', async (req, res) => {
	const tasks = await taskMongoose.find();

	res.status(200).json(tasks)
})

app.get('/tasks/:id', async (req, res) => {
		const task = await taskMongoose.findById(req.params.id, (error, result) => {
			if (error) {
				console.log(error);
				return res.status(400).json({ message: 'Task not found' });
			}
		});

		res.status(200).json(task)
})

app.post('/tasks', async (req, res) => {
	const task = new taskMongoose({ ...req.body, user: req.user._id });

	task.save()
		.then((saved) => {
			res.status(204).json(saved);
		})
		.catch(() => {
			res.status(400).json({ message: 'Task not saved' });
		});
})

app.delete('/tasks', async (req, res) => {
	const removedTask = await taskMongoose.deleteOne({ _id: req.body._id }, async (error, result) => {
		if (error) {
			return console.log(error);
		}
	})

	res.json(removedTask);
})

app.put('/tasks', async (req, res) => {
	const updateTask = await taskMongoose.updateOne({ _id: req.body._id }, { isFinished: req.body.isFinished }, (error, result) => {
		if (error) return console.log(error);
	})

	res.json(updateTask);
})

//Register
app.post('/register', async (req, res) => {
	const { repassword, ...restBody } = req.body;
	const isEmailExist = await userMongoose.findOne({email: restBody.email})
	
	if (isEmailExist) {
		return res.status(400).json({ messageError: 'Email is already registered' });
	}

	if (restBody.password === repassword) {
		const user = new userMongoose(restBody);

		await user.save();

		return res.status(201).send();
	}

	res.status(400).json({ messageError: 'Error registration!' });

});

//Auth
app.post('/auth', async (req, res) => {
	const { username, password } = req.body;

	const user = await userMongoose.findOne({ email: username });

	if (!user) {
		return res.status(401).send();
	}

	if (!user.validatePassword(password)) {
		return res.status(401).send();
	}

	const plainData = JSON.parse(JSON.stringify(user));
	delete plainData.password;

	res.status(200).json({
		...plainData,
		token: jwt.sign(plainData, 'Very secret code'),
	});
});

app.listen(3000, () => {
	console.log('Server works on port: 3000');
});
