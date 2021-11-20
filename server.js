const urlInfo = require('./url');
const personState = require('./calendar');
// const login = require('./dinner');
const cinemaState = require('./cinema');

const url = 'https://courselab.lnu.se/scraper-site-1';

const siteInfo = require('./constant');
const { filter } = require('lodash');

const FRIDAY = 'Friday';
const SATURDAY = 'Saturday';
const SUNDAY = 'Sunday';

const availableDinner = [
    {
        name: 'Friday',
        timeList: [
            {
                time: '14-16',
                state: 'Free'
            },
            {
                time: '16-18',
                state: 'Free'
            },
            {
                time: ' 18-20',
                state: 'Free'
            }
        ]
    },
    {
        name: 'Saturday',
        timeList: [
            {
                time: '18-20',
                state: 'Free'
            },
            {
                time: ' 20-22',
                state: 'Free'
            }
        ]
    },
    {
        name: 'Friday',
        timeList: [
            {
                time: '14-16',
                state: 'Free'
            },
            {
                time: '16-18',
                state: 'Free'
            },
            {
                time: ' 18-20',
                state: 'Free'
            },
            {
                time: ' 18-20',
                state: 'Free'
            }
        ]
    }
]

const getInfoFromUrl = (url) => {
    
    return new Promise((resolve, reject) => {
        urlInfo(url)
        .then(async (data) => {
            console.log('Scraping links...OK');
            const personInfo = [];
            let availableCinema = [];

            for (let index = 0; index < data.length; index++) {
                const value = data[index];
                switch(value.name)
                {
                    case siteInfo[0]['name']:
                        const res = await urlInfo(value.url)
                        console.log('Scraping available days...OK');
                        await Promise.all(res.map(man =>
                            personState(value.url + (man.url).replace('./', ''))
                            .then((res) => {
                                personInfo.push(res);
                                return;
                            })
                        ));
                        break;
                    case siteInfo[1]['name']:
                        let availableDays = [];
                        if(personInfo[0][FRIDAY] && personInfo[1][FRIDAY] && personInfo[2][FRIDAY])
                                availableDays.push(FRIDAY);
                        else{
                            if(personInfo[0][SATURDAY] && personInfo[1][SATURDAY] && personInfo[2][SATURDAY])
                                availableDays.push(SATURDAY);
                            else{
                                if(personInfo[0][SUNDAY] && personInfo[1][SUNDAY] && personInfo[2][SUNDAY])
                                    availableDays.push(SUNDAY);
                                else
                                    console.log('We cant play together!');
                            }
                        }
                        if(availableDays.length === 0)
                            break;
                        let cinema = await cinemaState(value.url);
                        availableCinema = cinema.filter((ele) => {
                            for(let i = 0; i < availableDays.length; i++){
                                if(availableDays[i] === ele.name)
                                    return true;
                                else return false;
                            }
                        })
                        break;
                    case siteInfo[2]['name']:
                        // console.log(availableCinema[0]['value'][0]['timeList']);
                        // login(value.url);
                        for(let i = 0; i < availableCinema.length; i++)
                        {
                            for(let j = 0; j < availableDinner.length; j++){
                                console.log(availableCinema[i].name + '=====' + availableDinner[j].name);
                                if(availableCinema[i].name === availableDinner[j].name){
                                    let movieList = availableCinema[i].value;
                                    for(let p = 0; p < movieList.length; p++){
                                        let cinemaTimeList = movieList[p]['timeList'];
                                        let dinnerTimeList = availableDinner[j]['timeList'];
                                        console.log(timeList);
                                    }
                                    // movieList.filter((ele) => {
                                    //     let timeList = ele.timeList;
                                    //     timeList.forEach(ele => {
                                    //         let cinemaTime = ele.time.split('-');
                                    //         availableDinner.timeList.forEach(ele => {
                                    //             let dinnerTime = ele.time.split('-');
                                    //             if((parseInt(cinemaTime[1]) + 2) < parseInt(dinnerTime[0]))
                                    //                 return true;
                                    //             else
                                    //                 return false;
                                    //         })
                                    //     });
                                    // })
                                }
                            }
                        }
                        break;
                }
            }
        })
    })
}

getInfoFromUrl(url)
.then((data) => {
    // console.log(data);
})
