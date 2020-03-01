const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const hbs = require('hbs')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const http = require('http')
const socketIO = require('socket.io')
var cookieToObject = require('cookie-parse')

const getArticles = require('./getArticles')

mongoose.connect('mongodb://localhost:27017/articles', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

const userMongoose = require('./models/user')
const articlesMongoose = require('./models/articles')

const app = express()

const server = http.Server(app)
const io = socketIO(server)

io.use((socket, next) => {
	const token = cookieToObject.parse(socket.request.headers.cookie).authToken

	if (token) {
		jwt.verify(token, 'Very secret code', err => {
			if (err) {
				return next(new Error('Token not valid'))
			}

			next()
		})
	}

	return next(new Error('Token not valid'))
})

io.on('connection', function(socket) {
	console.log('a user connected')

	socket.on('fetch', async (data) => {
		const articlesCount = data.count

		try {
			const articles = await getArticles(articlesCount)

			mongoose.connection.db.dropCollection('articles', function(err, result) {
				if (err) {
					console.log(err)
				}
			})

			articles.data.map(async atricle => {
				const articlesForBase = new articlesMongoose(atricle)

				await articlesForBase.save()
			})

			socket.broadcast.emit(`fetch`, articles)
			socket.emit(`fetch`, articles)
		} catch (error) {
			res.send('В данный момент статьи не доступны или произошла ошибка')
			console.log(error)
		}
	})
})

app.use(cookieParser())

app.set('view engine', 'hbs')
app.set('views', path.resolve(__dirname, 'templates/views'))
hbs.registerPartials(path.resolve(__dirname, 'templates/partials'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

const checkAuth = (req, res, next) => {
	const authToken = req.cookies && req.cookies.authToken

	if (authToken) {
		jwt.verify(authToken, 'Very secret code', (err, decoded) => {
			if (err) {
				res.redirect('/auth')
			}

			req.user = decoded
			next()
		})
	} else {
		res.redirect('/auth')
	}
}

app.use('/articles', checkAuth)

app.get('/articles', (req, res) => {
	res.render('articles', {})
})

app.get('/', (req, res) => {
	const authToken = req.cookies && req.cookies.authToken

	if (authToken) {
		res.redirect('/articles')
	} else {
		res.redirect('/auth')
	}
})

app.get('/registration', async (req, res) => {
	res.render('registration')
})

app.post('/registration', async (req, res) => {
	const { repassword, ...restBody } = req.body

	if (restBody.password === repassword) {
		const user = new userMongoose(restBody)

		await user.save()
		res.redirect('/auth')
	} else {
		res.status(400).json({ messageError: 'Error registration!' })
	}
})

app.get('/auth', (req, res) => {
	const { error } = req.query
	res.render('auth', { error })
})

app.post('/auth', async (req, res) => {
	const { username, password } = req.body
	const user = await userMongoose.findOne({ email: username })

	if (!user) {
		return res.status(401).send()
	}

	if (!user.validatePassword(password)) {
		return res.status(401).send()
	}

	const plainData = JSON.parse(JSON.stringify(user))
	delete plainData.password
	const token = jwt.sign(plainData, 'Very secret code')

	res.cookie('authToken', `${token}`)
	res.redirect('/articles')
})

app.get('/logout', (req, res) => {
	res.clearCookie('authToken')
	res.redirect('/auth')
})

server.listen(3000, () => {
	console.log('Server works on port 3000')
})
