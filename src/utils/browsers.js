const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");
const config = require("../config/config");

// Add adblocker plugin, which will transparently block ads in all pages you
// create using puppeteer.
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(
    AdblockerPlugin({
        // Optionally enable Cooperative Mode for several request interceptors
        interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
    })
)


const initBrowser = async (browsers) => {
    puppeteer.use(pluginStealth());
    for (let i = 1; i <= JSON.parse(config.numberBrowser); i++) {
        const browser = await puppeteer.launch({
            executablePath: executablePath(),
            headless: JSON.parse(config.headless),
            ignoreHTTPSErrors: true,
            args: [
                "--no-sandbox",
                '--disable-features=site-per-process',

                '--aggressive-cache-discard',
                '--disable-cache',
                '--disable-application-cache',
                '--disable-offline-load-stale-cache',
                '--disable-gpu-shader-disk-cache',
                '--media-cache-size=0',
                '--disk-cache-size=0',

                // '--disable-extensions',
                // '--disable-component-extensions-with-backg.round-pages',
                // '--disable-default-apps',
                // '--mute-audio',
                // '--no-default-browser-check',
                // '--autoplay-policy=user-gesture-required',
                // '--disable-background-timer-throttling',
                // '--disable-backgrounding-occluded-windows',
                // '--disable-notifications',
                // '--disable-background-networking',
                // '--disable-breakpad',
                // '--disable-component-update',
                // '--disable-domain-reliability',
                // '--disable-sync',
            ],
        });
        browsers.push({ status: 0, browser: browser });
    }

    return true;
}

const getBrowser = async (browsers) => {
    let minPagesLength = Infinity;
    let minPagesBrowser = null;

    for (const browser of browsers) {
        const pages = await browser.browser.pages();
        if (pages.length <= JSON.parse(config.numberBrowser) && pages.length < minPagesLength) {
            minPagesLength = pages.length;
            minPagesBrowser = browser;
        }
    }
    return minPagesBrowser || false;
}

const clearBrowser = async (browsers) => {
    for (const browser of browsers) {
        const br = browser.browser
        let tabLength = await (await br.pages()).length
        while (tabLength > 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            tabLength = await (await br.pages()).length
        }
        br.close();
    }
}

const checkPendingBrowsers = async (browsers) => {
    for (const browser of browsers) {
        let tabLength = await (await browser.browser.pages()).length
        while (tabLength > 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            tabLength = await (await browser.browser.pages()).length
        }
    }
}

const makeBrowserPending = async (browser, page) => {
    await page.close();
    // browser.status = 0
    return true;
}

module.exports = { initBrowser, getBrowser, clearBrowser, makeBrowserPending, checkPendingBrowsers }
