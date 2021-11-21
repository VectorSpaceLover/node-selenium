const urlInfo = require('./url');
const personState = require('./calendar');
const login = require('./dinner');
const cinemaState = require('./cinema');

const url = 'https://courselab.lnu.se/scraper-site-2';

const siteInfo = require('./constant');
const FRIDAY = 'Friday';
const SATURDAY = 'Saturday';
const SUNDAY = 'Sunday';

const getInfoFromUrl = (url) => {
    console.log(url);
    
    return new Promise((resolve, reject) => {
        urlInfo(url)
        .then(async (data) => {
            console.log('Scraping links...OK');
            const personInfo = [];
            let availableCinema = [];
            let availableDinner = [];

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
                        console.log('Scraping showtimes...OK');
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
                        availableDinner = await login(value.url);
                        for(let i = 0; i < availableCinema.length; i++)
                        {
                            for(let j = 0; j < availableDinner.length; j++){
                                if(availableCinema[i].name === availableDinner[j].name){
                                    let movieList = availableCinema[i].value;
                                    for(let p = 0; p < movieList.length; p++){
                                        let cinemaTimeList = movieList[p]['timeList'];
                                        let dinnerTimeList = availableDinner[j]['timeList'];
                                        let dinner = {};
                                        cinemaTimeList = cinemaTimeList.filter((ele) => {
                                            let cineamTime = ele['time'].split(':');
                                            let bFound = false;
                                            for(let jj = 0; jj < dinnerTimeList.length; jj++){
                                                dinner = dinnerTimeList[jj]['time']
                                                let dinnerTime = dinnerTimeList[jj]['time'].split('-');
                                                if(parseInt(cineamTime[0]) + 2 <= parseInt(dinnerTime[0])){
                                                    bFound = true;
                                                    break;
                                                }
                                                else
                                                    bFound = false;
                                            }
                                            return bFound;
                                        })
                                        movieList[p]['timeList'] = cinemaTimeList;
                                        movieList[p]['dinner'] =  dinner;
                                    }
                                    availableCinema[i].value = movieList;
                                }
                            }
                        }
                        
                        if(availableCinema.length > 0)
                        {
                            console.log('Scraping possible reservations...OK');
                            console.log('                ');
                            console.log('                ');
                            console.log('                ');
                            console.log('Recommendations');
                            console.log('                ');
                            console.log('================');
                            availableCinema.forEach(ele => {
                                // console.log(ele);
                                let day = ele['name'];
                                let arr = ele['value'];
                                arr.forEach((ele) => {
                                    let time = ele['timeList'];
                                    let outPut;
                                    time.forEach(val => {
                                        outPut = 'On ' + day + ' the movie ' + ele['movie'] + ' starts at ' + val['time'] + ' and there is a free table between ' + ele['dinner'];
                                        console.log(outPut);
                                    });
                                })
                            });
                        }
                        
                        // console.log(availableCinema[0]['value'][0]);
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
