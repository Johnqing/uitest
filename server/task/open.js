const path = require('path');
const dirname = __dirname;
const puppeteer = require('puppeteer-cn');

const diff = require('./diff');

async function createPage(viewPort, userinfo, hotelName){
	const browser = await puppeteer.launch({ 
		// executablePath: '/Users/Charles/Desktop/temp/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
		executablePath: '/mnt/chrome-linux/chrome',
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});
	const page = await browser.newPage();
  
	const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3704.0 Safari/537.36'
	console.log('[viewPort]', viewPort);
	await page.setViewport(viewPort);
	await page.setUserAgent(userAgent);
	// await page.setDefaultNavigationTimeout(30000 * 10)

	console.log('[login]', 'start');
	await page.goto('http://dv-officiel.brandwisdom.cn/index.php?c=content&a=lo');

	await page.click('#txtUserName');
	await page.type('#txtUserName', userinfo.username, {delay: 200});
	await page.click('#txtPassword');
	await page.type('#txtPassword', userinfo.password, {delay: 200});
	await page.click('.login-button button', {delay:1000});
	console.log('[login]', 'success');
	await page.waitForNavigation({
		waitUntil: 'networkidle2'
	});

	if(hotelName){
		console.log('[switchhotel]', 'start', hotelName);
		const value = await page.evaluate((hotelName) => {
			$('.bi-wrap-bg-menu').hide();
			const links = [...document.querySelectorAll('#header-chosen-hotel option')];
			let value;
			links.forEach((el) => {
				const text = el.innerText;
				console.log(text, el.value, hotelName)
				if(text === hotelName){
					value = el.value;
				}
			})
			return value;
		}, hotelName);
		console.log('[switchhotel]', value);
		
		// 如果酒店id不存在就不管了
		if(typeof value !== 'undefined'){
			await page.goto(`http://dv-www.brandwisdom.cn/HotelSel/index?RootVHotelID=${value}`, {
				waitUtil: 'networkidle2'
			});
		}
		console.log('[switchhotel]', 'end');
	}
	
	return {page, browser};
}

function createFilePath(project, id, type){
    return path.resolve(dirname, `../../client/dist/img/${project}/${id}/${type}.png`)
}

async function screenshot({screenshotUrl, project, id, pid, hotelName, viewport_width, username, password}){
    const { page, browser } = await createPage({
		width: parseInt(viewport_width),
		height: 800
	}, {username, password}, hotelName);
	console.log('[screenshotUrl]', 'start');

	await page.goto(screenshotUrl, {
        waitUtil: 'networkidle2'
	});
	console.log('[screenshotUrl]', 'end');
	
	const screenshotFilePath = createFilePath(project, id, 'screenshot');	
    const uiFilePath = createFilePath(project, id, 'ui');
	await page.screenshot({ path: screenshotFilePath, fullPage: true });
	console.log('[screenshotImg]', 'end');
	
	await browser.close();
	console.log('[diff]', 'start');
	
	return await diff(uiFilePath, screenshotFilePath);
	
}
module.exports = async (config = {}) => {
	return await screenshot(config);
};
