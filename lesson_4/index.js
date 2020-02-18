const express = require('express');
// const consolidate = require('consolidate');
const path = require('path');
const hbs = require("hbs");

const getArticles = require('./getArticles');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'templates/views'));
hbs.registerPartials(path.resolve(__dirname, 'templates/partials'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render('main', {})
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

app.listen(3000, () => {
    console.log('Server started on 3000 port');
})

