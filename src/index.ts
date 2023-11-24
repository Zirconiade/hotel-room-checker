import axios from 'axios';
import cheerio from 'cheerio';
import https from 'https';
import puppeteer from 'puppeteer';

let isRunning = false;
async function checkRoomAvailability(): Promise<void> {
    if (isRunning) {
        console.log('Still running, skipping this rerun iteration.');
        return;
    }

    isRunning = true;
    const url = 'https://registration.experientevent.com/ShowMFS241/Flow/GUEST#!/registrant//RoomSearch/';

    const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: false });
    const page = await (browser.newPage());

    try {
        // const agent = new https.Agent({
        //     rejectUnauthorized: false,
        //     secureProtocol: 'TLSv1_2_method'
        // });
        // const response = await axios.get(url, {httpsAgent: agent});
        // const html = response.data;
        // const cheerioScreen = cheerio.load(html);

        console.log(`Attemping to go to the url: ${url}`);
        const availSelector = 'body > div.wrapper > div > div > div > div > div.row.exl-top-padding-small.exl-bot-padding-small > div.medium-9.medium-pull-3.columns > ui-view > ui-view > div > div > div.alert-box.exl-top-margin-small.ng-scope';
        const buttonSelector = 'body > div.wrapper > div > div > div > div > div.row.exl-top-padding-small.exl-bot-padding-small > div.medium-9.medium-pull-3.columns > ui-view > ui-view > div > accordion > dl > dd > div > exl-room-search-criteria > form > button';

        await page.goto(url);
        console.log(`Waiting for page to load.`);
        await page.waitForSelector(buttonSelector);

        console.log(`Done waiting, clicking refresh page button`);
        await page.click('body > div.wrapper > div > div > div > div > div.row.exl-top-padding-small.exl-bot-padding-small > div.medium-9.medium-pull-3.columns > ui-view > ui-view > div > accordion > dl > dd > div > exl-room-search-criteria > form > button');

        console.log(`Waiting for page reload.`);
        await page.waitForSelector(availSelector);


        // Find specific HTML Element for where the room appears
        console.log(`Checking if any rooms are available via element text.`);
        const availableRooms = await page.$eval(availSelector, (element) => element.textContent);
        // const availableRooms = cheerioScreen('.wrapper .main-content-wrap .row.page-content .columns .maincontent .row.exl-top-padding-small.exl-bot-padding-small .medium-9.medium-pull-3.columns .ui-view.ng-scope .room-search.ng-scope .search-results.ng-scope .alert-box.exl-top-margin-small');
        if (availableRooms?.includes('No rooms are available that meet your search criteria.')) {
            console.log('No rooms available :(');
        } else {
            console.log('Rooms are available! GO GO GO!');
        }
    } catch (error) {
        console.error(`Error fetching/parsing the given webpage: ${url}, error: ${error}`);
    } finally {
        await browser.close();
        isRunning = false;
    }

    // Call infinitely
    setInterval(async () => {
        try {
            console.log('Running checkRoomAvailability again...');
            await checkRoomAvailability(); // Call the function again
        } catch (error) {
            console.error(`Error running checkRoomAvailability: ${error}`);
        }
    }, 5000); // Repeat every 5 seconds (5000 milliseconds)
}


checkRoomAvailability().catch((error) => {
    console.error(`Error running function checkRoomAvailability: ${error}`)
})