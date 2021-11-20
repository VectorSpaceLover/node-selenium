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
var service = new chrome.ServiceBuilder(path).build();
    chrome.setDefaultService(service);
let browser = new swd.Builder();
let tab = browser
.forBrowser("chrome")
// .withCapabilities(swd.Capabilities.chrome())
// .setChromeOptions(options)
.build();

const { By } = swd;

// Get the credentials from the JSON file
// let { email, pass } = require("./credentials.json");
const email = 'zeke';
const pass = 'coys';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const dinnerState = function(url)
{
    let info = {};
    console.log(url);
    return rp(url)
    .then(function(html){
        $ = cheerio.load(html);
        console.log(html);
        $('.WordSection2 > .MsoNormal > span').each((i, data) => {
            console.log($(data).text().trim());
        });
        // $('tbody > tr > td').each((i, data) => {
        //     let newItem = {}
        //     newItem[days[i]] = $(data).text().trim().toUpperCase();
        //     info = { ...info, ...newItem};
        // });
        // return info;
    })
    .catch(function(err){
        console.log('error' + err.message);
        return null;
    });
}

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
        dinnerState(url + 'login/booking');
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = login;