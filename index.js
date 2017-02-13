'use strict';

const fs        = require('fs');
const path      = require('path');
const webdriver = require('selenium-webdriver');
const phantom   = webdriver.Capabilities.phantomjs().set('phantomjs.binary.path', require('phantomjs-prebuilt').path);
const script    =  fs.readFileSync(path.join(__dirname, './lib/sense.js'), 'utf8');
let cases       = [];
let driver      = null;
let savePath;

function runNext() {
    if (cases.length === 0) {
        driver.quit();
        return;
    }

    const testCase = cases.shift();

    driver.manage().deleteAllCookies();
    driver.manage().window().setSize(testCase.viewport.width, testCase.viewport.height);
    driver.get(testCase.url)
        .then(() => {
            return driver.takeScreenshot();
        })
        .then((image, err) => {
            fs.writeFile(path.join(savePath, `${testCase.name}.png`), image, 'base64');
            return driver.executeScript(`${script}\ntry { Sense.init(document.body); return Sense.getJSON(); } catch(e) { return { error: e }; }`);
        })
        .then((response) => {
            fs.writeFile(path.join(savePath, `${testCase.name}.json`), response, 'utf-8');
            runNext();
        })
}

module.exports.init = (config) => {
    cases = config.cases;

    if (cases.length < 1) return false;

    savePath = path.join(config.cwd, config.dir, config.timestamp);
    driver = new webdriver.Builder().withCapabilities(phantom).build();
    driver.get('about:blank').then(function () {
        runNext();
    });
};
