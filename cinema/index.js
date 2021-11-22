// Include the chrome driver
require('chromedriver');
const rp = require('request-promise');
const cheerio = require('cheerio');
// Include selenium webdriver
const swd = require('selenium-webdriver');
chrome = require('selenium-webdriver/chrome');
options = new chrome.Options();
options.addArguments('headless');
options.addArguments('disable-gpu');

const browser = new swd.Builder();
const tab = browser
    .forBrowser('chrome')
    .withCapabilities(swd.Capabilities.chrome())
    .setChromeOptions(options)
    .build();

const {By} = swd;

// const cinemaTemp = [
//   {
//     name: 'friday',
//     value: [
//       {
//         movie: 'Start',
//         timeList: [
//           {
//             time: '',
//             state: '',
//           },
//           {
//             time: '',
//             state: '',
//           },
//         ],
//       },
//       {
//         movie: 'Start',
//         timeList: [
//           {
//             time: '',
//             state: '',
//           },
//           {
//             time: '',
//             state: '',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: 'friday',
//     value: [
//       {
//         movie: 'Start',
//         timeList: [
//           {
//             time: '',
//             state: '',
//           },
//           {
//             time: '',
//             state: '',
//           },
//         ],
//       },
//       {
//         movie: 'Start',
//         timeList: [
//           {
//             time: '',
//             state: '',
//           },
//           {
//             time: '',
//             state: '',
//           },
//         ],
//       },
//     ],
//   },
// ];

let cinema = [];

/**
 * @param {int} ms .
 * @return {function} .
 */
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getInfoFromCinema = (url) => new Promise((resolve, reject) => {
  const ret = [];
  rp(url)
      .then(function(html) {
        $ = cheerio.load(html);
        $('#day > option ').each((i, data) => {
          if ($(data).text().search('Pick a day') < 0) {
            const newItem = [];
            newItem['name'] = $(data).text().trim();
            const tmp = ret[i - 1];
            newValue = {...tmp, ...newItem, value: []};
            ret[i - 1] = newValue;
            $('#movie > option ').each((j, data) => {
              if ($(data).text().search('Pick a Movie') < 0) {
                const item = {};
                item['movie'] = $(data).text().trim();
                item['timeList'] = [];
                const tmp = ret[i - 1].value;
                const newVal = [...tmp, item];
                ret[i - 1].value = newVal;
              }
            });
          }
        });

        resolve(ret);
      })
      .catch((err) => reject(err.message));
});
// Step 1 - Opening the geeksforgeeks sign in page
/**
 * @param {string} url .
 * @return {array} .
 */
async function cinemaState(url) {
  try {
    cinema = await getInfoFromCinema(url);
    const tabToOpen = await tab.get(url);
    await tabToOpen;
    await tab.manage().setTimeouts({
      implicit: 10000, // 10 seconds
    });

    const firstForm = await tab.findElement(
        By.xpath(`//form[@action="cinema/day"]`));
    const firstInput = await firstForm.findElement({tagName: 'input'});
    const secondForm = await tab.findElement(
        By.xpath(`//form[@action="cinema/movie"]`));
    const secondInput = await secondForm.findElement({tagName: 'input'});

    for (let i = 0; i < cinema.length; i++) {
      firstInput.click();
      await timeout(700);
      const dayList = await firstForm.findElements({tagName: 'li'});
      dayList[i + 1].click();
      await timeout(700);
      const movieList = await secondForm.findElements({tagName: 'li'});
      for (let j = 0; j < movieList.length - 1; j++) {
        secondInput.click();
        await timeout(700);
        movieList[j + 1].click();
        await timeout(700);
        const btnCheck = await tab.findElement(
            {tagName: 'button', id: 'check'});
        btnCheck.click();
        await timeout(700);
        await tab.findElement(By.xpath(`//div[@id="message"]`))
            .then(function(val) {
              val.getText()
                  .then((text) => {
                    const line = text.split('\n');
                    const str = line.map((val) => val.split(' : '));
                    str.map((ele) => {
                      if (ele[1] === 'Sites available') {
                        cinema[i].value[j]['timeList']
                            .push({time: ele[0], state: ele[1]});
                      }
                    });
                  });
            });
      }
    }
    return cinema;
  } catch (err) {
    console.log(err.message);
  } finally {
  }
}

module.exports = cinemaState;
