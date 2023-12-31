const config = require("../config/config");
const { getUncrawledChapters, findChapters } = require("../services/ChapterService");
const { getUncrawledStories } = require("../services/StoryService");
const { initBrowser, getBrowser, clearBrowser, checkPendingBrowsers } = require("../utils/browsers");
const { crawlPage, CrawlStory, crawlChapter } = require("../utils/crawl");

let browsers = [];

const crawl = async (req, res) => {
    const data = await req.body;
    let startPage = data.startPage || 0;
    let endPage = data.endPage || 600;

    await initBrowser(browsers);
    let browser = null;
    let i = 0;

    while (startPage++ < endPage) {
        browser = await getBrowser(browsers);

        try {
            if (browser) {
                const pageUrl = config.host + '?page=' + i;
                crawlPage(browser, pageUrl, true);
                await new Promise(resolve => setTimeout(resolve, 250));
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error(error);
            break;
        }
    }

    await checkPendingBrowsers(browsers);

    let uncrawledStories = await getUncrawledStories() || [];
    while (uncrawledStories.length) {
        browser = await getBrowser(browsers);

        if (browser) {
            const story = uncrawledStories.shift();
            CrawlStory(browser, story.url, true);
            await new Promise(resolve => setTimeout(resolve, 250));
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    await checkPendingBrowsers(browsers);

    let uncrawledChapters = await getUncrawledChapters() || [];
    while (uncrawledChapters.length) {
        browser = await getBrowser(browsers);

        if (browser) {
            const chapter = uncrawledChapters.shift();
            crawlChapter(browser, chapter.url);
            await new Promise(resolve => setTimeout(resolve, 250));
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    await clearBrowser(browsers);

    return true;
};

const crawlStories = async (req, res) => {
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
        res.status(404).send("Can't find chapters urls!");
        return false;
    };

    while (uncrawledChapters.length) {
        browser = await getBrowser(browsers);

        if (browser) {
            const chapter = uncrawledChapters.shift();
            crawlChapter(browser, chapter.url);
            await new Promise(resolve => setTimeout(resolve, 250));
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    };

    await clearBrowser(browsers);
    res.status(200).send("Done!");
    return true;
};

const crawlChapters = async (req, res) => {
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
    res.status(200).send("Done!");
    return true;
};

module.exports = { crawl, crawlStories, crawlChapters };
