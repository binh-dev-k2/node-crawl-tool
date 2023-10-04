
const initBrowser = async (browsers) => {
    for (let i = 1; i <= config.numberBrowser; i++) {
        const browser = await puppeteer.launch({
            headless: config.headless,
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
                // '--disable-component-extensions-with-background-pages',
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
        if (pages.length <= config.numberBrowser && pages.length < minPagesLength) {
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
