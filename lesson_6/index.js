const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require("hbs");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const getArticles = require('./getArticles');

mongoose.connect('mongodb://localhost:27017/users', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const userMongoose = require('./models/user');
const passport = require('./passport');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'templates/views'));
hbs.registerPartials(path.resolve(__dirname, 'templates/partials'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Сессии и авторизация
app.use(session({
	resave: true,
	saveUninitialized: false,
	secret: 'gsdfhsdafgasdfhdsffdsa',
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));


app.use(passport.initialize);
app.use(passport.session);

//Secure
app.use('/articles', passport.mustAuth);
// app.use('/', passport.mustAuth);

app.get('/', (req, res) => {
	if (req.user && req.user._id) {
		res.render('main', {})
	} else {
		res.redirect('/auth');
	}
})

app.post('/articles', async (req, res) => {
	const articlesCount = req.body.articles_count;

	try {
		const articles = await getArticles(articlesCount);

		res.render('articles', articles);
	} catch (error) {
		res.send('В данный момент статьи не доступны или произошла ошибка');
		console.log(error);
	}
})

app.get('/registration', async (req, res) => {
	res.render('registration');
})

app.post('/registration', async (req, res) => {
	const { repassword, ...restBody } = req.body;

	if (restBody.password === repassword) {
		const user = new userMongoose(restBody);

		await user.save();
		res.redirect('/auth');
	} else {
		res.redirect('/auth?error=err1');
	}
})

app.get('/auth', (req, res) => {
	const { error } = req.query;
	res.render('auth', { error });
})

app.post('/auth', passport.autenticate);

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/auth');
})

app.listen(3000, () => {
	console.log('Server started on 3000 port');
})

