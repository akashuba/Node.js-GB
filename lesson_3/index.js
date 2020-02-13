var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var url = require('url');

http.createServer(function(request, response) {
	response.setHeader("Content-Type", "application/json");
	const count = url.parse(request.url, true).query 
					&& url.parse(request.url, true).query.count || 5;			

	if(request.url === "/articles" || request.url === "/" || request.url === `/articles?count=${count}`){
        try {
			getArticles(function(articles) {
				response.write(JSON.stringify(articles));
				response.end();
			}, count)
		} catch (error) {
			response.write('В данный момент статьи не доступны или произошла ошибка');
			console.log(error);
			response.end();
		}
	}
	console.log('Server running on port: 3000');
}).listen(3000);

function getArticles (callback, count) {
	request('https://medium.com/tag/javascript', function (error, response, html) {
		const articlesList = [];
		
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
	
			$('.graf--title').each(function(index, element) {	
				if (index < count) {
					articlesList.push({
						title: $(this).text(),
						subtitle: $(this).next().text(),
					})
				}
			});

			callback(articlesList);	
		} else {
			throw error
		}
	});
}
