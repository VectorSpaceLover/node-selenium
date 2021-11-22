<!--lint disable no-literal-urls-->

<p align="center">
  <a href="https://nodejs.org/">
    <img
      alt="Node.js"
      src="https://nodejs.org/static/images/logo-light.svg"
      width="400"
    />
  </a>
</p>

### Disclaimer

Selenium is a browser automation tool. This particular repository only covers Selenium setup for Node.js(Javascript) based programming language.

node.js is very good in web scraping and backend language in web development.

Now node.js is top in web scraping. Of course, In web developing, Node.js and Express.js is also top, but I am explaining web scraping here.

To continue further development with this tool, make sure to read following guide.


### Prerequisites

- [Node](https://nodejs.org/en/download/)
- [Selenium](https://github.com/SeleniumHQ/selenium/tree/master/javascript/node/selenium-webdriver#installation)

Optional:
- [Chrome WebDriver](https://www.npmjs.com/package/chromedriver#building-and-installing)
- [Firefox WebDriver](https://www.npmjs.com/package/geckodriver#install)

Note that you will need to install at least one of the above WebDrivers in the [Installation](#installation) part.

### Installation

1. Once you have all the required prerequisites ready, create your project folder:

```
mkdir node-selenium
cd node-selenium
npm init
npm install selenium-webdriver
```

2. When project directory is setup, you will need to install one of the WebDrivers from the [Prerequisites](#prerequisites) section.

*Firefox*

<img src="https://i.imgur.com/I9czv1a.png">

*Chrome*

<img src="https://i.imgur.com/ALgnAQf.png">

3. Download our server script accordingly to the WebDriver you are using, by using one of these commands: 

*Chrome*

```curl https://github.com/Venus9023/node-selenium/server.js > server.js```

you can download chromdrver.exe from https://www.automationtestinghub.com/download-chrome-driver/


4. Usage

You can input npm start <url> in command prompt. Url is server url. So you can expand this project if you want.
