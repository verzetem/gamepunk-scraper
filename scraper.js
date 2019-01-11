// Array.from(document.querySelectorAll('.primary-content > section > section > article'))

const puppeteer = require('puppeteer');

(async () => {
	let gameSpotUrl = 'https://www.gamespot.com/pc/';
	let kotakuUrl = 'https://kotaku.com/c/review/video-games'

	let browser = await puppeteer.launch();
	let page = await browser.newPage();
	
	await page.goto(gameSpotUrl);

	const gameSpotArticles = await page.evaluate(() => {
		
		// scrape articles from site
		let articles = Array.from(document.querySelectorAll('.primary-content > section > section > article'))
		.map(article => {
			return {
				article_url: article.querySelector('a').href,
				title: article.innerText,
				img_url: article.querySelector('img').src,
				publisher_id: 1
			};
		})
		return articles
	})
	console.log(gameSpotArticles)
	
	await page.goto(kotakuUrl);
	await autoScroll(page);
	const kotakuArticles = await page.evaluate(() => {

		
		// scrape articles from site
		let articles = Array.from(document.querySelectorAll('article'))
		.map(article => {
			return {
				article_url: article.querySelector('.item__content > .item__text > h1 > a').href,
				title: article.querySelector('.item__content > .item__text > h1').innerText,
				img_url: article.querySelector('figure > div > a > div > div > img').src,
				publisher_id: 2
			};
		})
		return articles
	})
	console.log('kotaku',kotakuArticles)
})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}