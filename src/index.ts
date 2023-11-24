import axios from 'axios';
import cheerio from 'cheerio';
import https from 'https';

async function checkRoomAvailability(): Promise<void> {
    console.log('Starting application...');
    const url = 'https://registration.experientevent.com/ShowMFS241/Flow/GUEST#!/registrant//RoomSearch/';
    
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false,
            secureProtocol: 'TLSv1_2_method'
        });
        const response = await axios.get(url, {httpsAgent: agent});
        const html = response.data;
        const cheerioScreen = cheerio.load(html);

        // Find specific HTML Element for where the room appears
        const availableRooms = cheerioScreen('.wrapper .main-content-wrap .row.page-content .columns .maincontent .row.exl-top-padding-small.exl-bot-padding-small .medium-9.medium-pull-3.columns .ui-view.ng-scope .room-search.ng-scope .search-results.ng-scope .alert-box.exl-top-margin-small');
        if(availableRooms.text().includes('No rooms are available that meet your search criteria.')) {
            console.log('No rooms available :(');
        } else {
            console.log('Rooms are available! GO GO GO!');
        }
    } catch (error) {
        console.error(`Error fetching/parsing the given webpage: ${url}, error: ${error}`);
    }
}

checkRoomAvailability().then(() => {
    console.log(`Function execution complete.`);
}).catch((error) => {
    console.error(`Error running function checkRoomAvailability: ${error}`)
})