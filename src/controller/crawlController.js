const config = require("../config/config");
const { getUncrawledChapters, findChapters } = require("../services/ChapterService");
const { getUncrawledStories } = require("../services/StoryService");
const { initBrowser, getBrowser, clearBrowser, checkPendingBrowsers } = require("../utils/browsers");
const { crawlPage, CrawlStory, crawlChapter } = require("../utils/crawl");
const { deletePuppeteerFolders } = require("../utils/tempFolder");

let browsers = [];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const crawl = async (req, res) => {
    try {
        await deletePuppeteerFolders();
        const data = await req.body;
        let startPage = data.startPage || 0;
        let endPage = data.endPage || 600;

        await initBrowser(browsers);
        let browser = null;

        while (startPage <= endPage) {
            browser = await getBrowser(browsers);

            try {
                if (browser) {
                    const pageUrl = config.nettruyenHost + '?page=' + startPage;
                    crawlPage(browser, pageUrl, true);
                    await sleep(250);
                } else {
                    await sleep(1000);
                }
            } catch (error) {
                console.error(error);
            }
            startPage++;
        }

        await checkPendingBrowsers(browsers);

        let uncrawledStories = await getUncrawledStories() || [];
        while (uncrawledStories.length) {
            browser = await getBrowser(browsers);

            if (browser) {
                const story = uncrawledStories.shift();
                CrawlStory(browser, story.url);
                await sleep(250);
            } else {
                await sleep(1000);
            }
        }

        await checkPendingBrowsers(browsers);

        let uncrawledChapters = await getUncrawledChapters() || [];
        while (uncrawledChapters.length) {
            browser = await getBrowser(browsers);

            if (browser) {
                const chapter = uncrawledChapters.shift();
                crawlChapter(browser, chapter.url);
                await sleep(250);
            } else {
                await sleep(1000);
            }
        }

        await clearBrowser(browsers);
        await deletePuppeteerFolders();

        return true;
    } catch (error) {
        await clearBrowser(browsers);
        await deletePuppeteerFolders();
        console.log(error);
        return false;
    }
};

const crawlStories = async (req, res) => {
    try {
        await deletePuppeteerFolders();
        const data = await req.body;
        await initBrowser(browsers);
        let browser = null;

        browser = await getBrowser(browsers);

        const story = browser ? await CrawlStory(browser, data.url) : false;

        if (!story) {
            await clearBrowser(browsers);
            res.status(404).send("Story url not found!");
            return false;
        }

        await checkPendingBrowsers(browsers);

        let uncrawledChapters = await findChapters(story._id);

        if (!uncrawledChapters) {
            await clearBrowser(browsers);
            res.status(404).send("Can't find chapters url!");
            return false;
        };

        while (uncrawledChapters.length) {
            browser = await getBrowser(browsers);

            if (browser) {
                const chapter = uncrawledChapters.shift();
                crawlChapter(browser, chapter.url);
                await sleep(250);
            } else {
                await sleep(1000);
            }
        };

        await clearBrowser(browsers);
        await deletePuppeteerFolders();
        res.status(200).send("Done!");
        return true;
    } catch (error) {
        await clearBrowser(browsers);
        await deletePuppeteerFolders();
        console.log(error);
        return false;
    }
};

const crawlChapters = async (req, res) => {
    try {
        await deletePuppeteerFolders();
        const data = await req.body;
        await initBrowser(browsers);
        let browser = null;

        browser = await getBrowser(browsers);

        const chapter = browser ? await crawlChapter(browser, data.url) : false;

        if (!chapter) {
            await clearBrowser(browsers);
            res.status(404).send("Chapter url not found!");
            return false;
        }

        await clearBrowser(browsers);
        await deletePuppeteerFolders();
        res.status(200).send("Done!");
        return true;
    } catch (error) {
        await clearBrowser(browsers);
        await deletePuppeteerFolders();
        console.log(error);
        return false;
    }
};

module.exports = { crawl, crawlStories, crawlChapters };
