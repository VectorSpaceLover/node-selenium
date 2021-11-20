// Include the chrome driver
require("chromedriver");

const rp = require('request-promise');
const cheerio = require('cheerio');
// Include selenium webdriver
const swd = require("selenium-webdriver");
chrome    = require('selenium-webdriver/chrome')
options   = new chrome.Options();
options.addArguments('headless'); // note: without dashes
options.addArguments('disable-gpu');
var path = require('chromedriver').path;
var service = new chrome.ServiceBuilder(path).build();
    chrome.setDefaultService(service);


const browser = new swd.Builder();
const tab = browser
.forBrowser("chrome")
.withCapabilities(swd.Capabilities.chrome())
.setChromeOptions(options)
.build();

const { By } = swd;

const cinemaTemp = [
    {
        name: 'friday',
        value: [
            {
                movie: 'Start',
                timeList: [
                    {
                        time: '',
                        state: '',
                    },
                    {
                        time: '',
                        state: '',
                    },
                ]
            },
            {
                movie: 'Start',
                timeList: [
                    {
                        time: '',
                        state: '',
                    },
                    {
                        time: '',
                        state: '',
                    },
                ]
            }
        ]
    },
    {
        name: 'friday',
        value: [
            {
                movie: 'Start',
                timeList: [
                    {
                        time: '',
                        state: '',
                    },
                    {
                        time: '',
                        state: '',
                    },
                ]
            },
            {
                movie: 'Start',
                timeList: [
                    {
                        time: '',
                        state: '',
                    },
                    {
                        time: '',
                        state: '',
                    },
                ]
            }
        ]
    },
];

let cinema = [];

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let getInfoFromCinema = (url) => new Promise((resolve, reject) => {
    let ret = [];
    rp(url)
    .then(function(html){
        $ = cheerio.load(html);
        $('#day > option ').each((i, data) => {
            if($(data).text().search('Pick a day') < 0)
            {
                let newItem = [];
                newItem['name'] = $(data).text().trim();
                let tmp = ret[i - 1];
                newValue = {...tmp,  ...newItem, value: []};
                ret[i - 1] = newValue;
                $('#movie > option ').each((j, data) => {
                    if($(data).text().search('Pick a Movie') < 0)
                    {
                        let item = {};
                        item['movie'] = $(data).text().trim();
                        item['timeList'] = [];
                        let tmp = ret[i - 1].value;
                        let newVal = [...tmp,  item];
                        ret[i - 1].value = newVal;
                    }
                });
                
            }
        });
        
        resolve(ret);
    })
    .catch(err => reject(err.message))
})
// Step 1 - Opening the geeksforgeeks sign in page
async function cinemaState(url)
{
    try {
        cinema = await getInfoFromCinema(url);
        let tabToOpen = await tab.get(url);
        await tabToOpen;
        let findTimeOutP = await tab.manage().setTimeouts({
            implicit: 10000, // 10 seconds
        });

        let firstForm = await tab.findElement(By.xpath(`//form[@action="cinema/day"]`));
        let firstInput = await firstForm.findElement({tagName: 'input'});
        const secondForm = await tab.findElement(By.xpath(`//form[@action="cinema/movie"]`));
        let secondInput = await secondForm.findElement({tagName: 'input'});

        for (let i = 0; i < cinema.length; i++) {
            firstInput.click();
            await timeout(500);
            const dayList = await firstForm.findElements({tagName: 'li'});
            dayList[i + 1].click();
            await timeout(500);
            const movieList = await secondForm.findElements({tagName: 'li'});
            for(let j = 0; j < movieList.length - 1; j++){
                secondInput.click();
                await timeout(500);
                movieList[j + 1].click();
                await timeout(500);
                const btnCheck = await tab.findElement({tagName: 'button', id: 'check'});
                btnCheck.click();
                await timeout(500);
                await tab.findElement(By.xpath(`//div[@id="message"]`))
                .then(function(val) {
                    val.getText()
                    .then(text => {
                        let line = text.split('\n');
                        let str = line.map((val) => val.split(' : '));
                        str.map((ele) => {
                            if(ele[1] === 'Sites available')
                                cinema[i].value[j]['timeList'].push({time: ele[0], state: ele[1]});
                        })
                    });
                })
            }
        }
        return cinema;
    } catch (err) {
        console.log(err.message);
    } finally{
    }
}

module.exports = cinemaState;