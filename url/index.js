const rp = require('request-promise');
const cheerio = require('cheerio');

const urlInfo = function(url) {
  const info = [];
  return rp(url)
      .then(function(html) {
        $ = cheerio.load(html);
        $('a').each(function() {
          const text = $(this).text();
          const link = $(this).attr('href');
          info.push({
            name: text.trim(),
            url: link,
          });
        });
        return info;
      })
      .catch(function(err) {
        console.log('request error');
        return null;
      });
};
module.exports = urlInfo;
