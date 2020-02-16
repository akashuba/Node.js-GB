var request = require('request');
var cheerio = require('cheerio');

function getArticles (count) {
	return new Promise ((resolve, reject) => {
		request('https://medium.com/tag/javascript', function (error, response, html) {
			const articlesList = {
				data: [],
			};
			
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(html);

				$('.streamItem--postPreview').each(function(index, element) {	
					if (index < count) {
						articlesList.data.push({
							title: $(this).find('.graf--title').text(),
							subtitle: $(this).find('.graf--subtitle').text(),
							link: $(this).find('a').eq(4).attr('href'),
						})
					}
				});

				resolve(articlesList);	
			} else {
				reject(error)
			}
		});
	})
}

module.exports = getArticles;