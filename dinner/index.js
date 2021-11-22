const rp = require('request-promise');
const cheerio = require('cheerio');

// Include the chrome driver
require("chromedriver");
  
const swd = require("selenium-webdriver");
chrome    = require('selenium-webdriver/chrome')
options   = new chrome.Options();
options.addArguments('headless'); // note: without dashes
options.addArguments('disable-gpu');
var path = require('chromedriver').path;
const { val } = require('cheerio/lib/api/attributes');
var service = new chrome.ServiceBuilder(path).build();
    chrome.setDefaultService(service);
let browser = new swd.Builder();
let tab = browser
.forBrowser("chrome")
.withCapabilities(swd.Capabilities.chrome())
.setChromeOptions(options)
.build();

const { By } = swd;

// Get the credentials from the JSON file
// let { email, pass } = require("./credentials.json");
const email = 'zeke';
const pass = 'coys';

let availableDinner = [
    {
        name: 'Friday',
        timeList: []
    },
    {
        name: 'Saturday',
        timeList: []
    },
    {
        name: 'Sunday',
        timeList: []
    },
];

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Step 1 - Opening the geeksforgeeks sign in page
async function login(url)
{
    try{
        let tabToOpen = await tab.get(url);
        await tabToOpen;
        let findTimeOutP = await tab.manage().setTimeouts({
            implicit: 10000, // 10 seconds
        });
        
        const userName = await tab.findElement(By.xpath(`//input[@name="username"]`));
        timeout(500);
        const passWord = await tab.findElement(By.xpath(`//input[@name="password"]`));
        timeout(500);
        const btnLogin = await tab.findElement(By.xpath(`//input[@name="submit"]`));
        timeout(500);
        await userName.sendKeys(email);
        timeout(500);
        await passWord.sendKeys(pass);
        timeout(500);
        await btnLogin.click();
        timeout(500);

        const ele1 = await tab.findElement(By.xpath(`//div[@class="WordSection2"]`));
        const ele2 = await tab.findElement(By.xpath(`//div[@class="WordSection4"]`));
        const ele3 = await tab.findElement(By.xpath(`//div[@class="WordSection6"]`));
        const ele1List = await ele1.findElements({tagName: 'span'});
        const ele2List = await ele2.findElements({tagName: 'span'});
        const ele3List = await ele3.findElements({tagName: 'span'});
        await Promise.all(ele1List.map( async(val) => {
            let res = await val.getText();
            if(res.indexOf('booked') < 0)
            {
                let arr = res.split(' ');
                let newItem = {time: arr[0], state: arr[1]};
                let tmp = availableDinner[0]['timeList'];
                let newData = [...tmp, newItem];
                availableDinner[0]['timeList'] = newData;
            }
        }))

        await Promise.all(ele2List.map(async (val) => {
            let res = await val.getText();
            if(res.indexOf('booked') < 0)
            {
                let arr = res.split(' ');
                availableDinner[1].timeList.push({time: arr[0], state: arr[1]});
            }

        }))
        
        await Promise.all(ele3List.map(async (val) => {
            let res = await val.getText();
            if(res.indexOf('booked') < 0)
            {
                let arr = res.split(' ');
                availableDinner[2].timeList.push({time: arr[0], state: arr[1]});
            }
        }))
        return availableDinner;
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = login;