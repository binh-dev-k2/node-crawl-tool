const { regexUrl } = require("../utils/url");
const { downloadImage, initImageStorage } = require("../utils/images");
const { insertChapter, updateChapter, updateChapters } = require("../services/ChapterService");
const { insertStory, updateStory, updateStories, findStory, insertStories } = require("../services/StoryService");
const { makeBrowserPending } = require("../utils/browsers");
const config = require("../config/config");
const useProxy = require('puppeteer-page-proxy');


const pageSelector = config.pageSelector
const storySelector = config.storySelector;
const chapterSelector = config.chapterSelector;

const crawlPage = async (browser, pageUrl, isNew = false) => {
    const page = await browser.browser.newPage();
    try {
        // await useProxy(page, 'socks4://43.153.99.33:1080');
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
        await page.waitForSelector(pageSelector.waited);
    } catch (error) {
        console.log(error);
        await makeBrowserPending(browser, page);
        return false;
    };

    return new Promise(async (resolve, reject) => {
        try {
            const extractedData = await page.evaluate((pageSelector, config) => {
                const stories = Array
                    .from(document.querySelectorAll(pageSelector.container))
                    .map(story => {
                        let href = story.getAttribute('href');
                        while (!href.startsWith('http') || !href.startsWith('https')) {
                            href = config.webHost + href
                        }

                        return {
                            url: href,
                            status: 0
                        }
                    });

                return stories;
            }, pageSelector, config);

            const stories = isNew ? await insertStories(extractedData) : await updateStories(extractedData);

            if (!stories) {
                await makeBrowserPending(browser, page);
                reject(false);
            }

            await makeBrowserPending(browser, page);
            resolve(true);
        } catch (error) {
            console.error(error);
            await makeBrowserPending(browser, page);
            reject(false);
        }
    });
}

const CrawlStory = async (browser, storyUrl, isNew = false) => {
    const page = await browser.browser.newPage();

    try {
        await page.goto(storyUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
        await page.waitForSelector(storySelector.waited);
        await page.waitForTimeout(2000);
    } catch (error) {
        console.log(error);
        await makeBrowserPending(browser, page);
        return false;
    }

    return new Promise(async (resolve, reject) => {
        try {
            const extractedData = await page.evaluate((storyUrl, storySelector, chapterSelector) => {
                let title = document
                    .querySelector(storySelector.title)

                title = title ? title.textContent : "NULL";

                let thumbnail = document
                    .querySelector(storySelector.thumbnail)
                    .getAttribute("src") || "NULL";

                while (thumbnail.startsWith('/')) {
                    thumbnail = thumbnail.replace('/', '');
                }

                if (thumbnail.startsWith('http://')) {
                    thumbnail = thumbnail.replace('http://', 'https://');
                }

                if (!thumbnail.startsWith('https://')) {
                    thumbnail = 'https://' + thumbnail;
                }

                const author = "NULL";

                let description = document
                    .querySelector(storySelector.description)

                description = description ? description.textContent : "Null";

                const chapters = Array
                    .from(document.querySelectorAll(chapterSelector.container))
                    .map(href => href.getAttribute("href"));

                const url = storyUrl;

                return {
                    story: {
                        title: title,
                        thumbnail: thumbnail,
                        url: url,
                        author: author,
                        description: description,
                        status: 1
                    },
                    chapters: chapters
                };

            }, storyUrl, storySelector, chapterSelector);

            const story = isNew
                ? await insertStory(extractedData.story)
                : await updateStory(extractedData.story);

            if (!story) {
                await makeBrowserPending(browser, page);
                reject(false);
            }

            const storyId = story._id;
            const data = extractedData.chapters.map(url => ({
                url: url,
                story_id: storyId,
                status: 0,
            }));

            let chapters = isNew ? await insertChapter(data) : await updateChapters(data);
            if (!chapters) {
                await makeBrowserPending(browser, page);
                reject(false);
            }

            await makeBrowserPending(browser, page);
            resolve(story);
        } catch (error) {
            console.error(error);
            await makeBrowserPending(browser, page);
            reject(false);
        }
    });
}

const crawlChapter = async (browser, chapterUrl, isNew = false) => {
    const page = await browser.browser.newPage();
    try {
        await page.goto(chapterUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
        // await page.waitForTimeout(1000);
        await page.waitForSelector(chapterSelector.images);
    } catch (error) {
        console.log(error + ' loi selector');
        await makeBrowserPending(browser, page);
        return false;
    }

    return new Promise(async (resolve, reject) => {
        try {
            const extractedData = await page.evaluate(async (chapterSelector, chapterUrl) => {
                const chap = await document
                    .querySelector(chapterSelector.chap)
                    .textContent || "- Null"
                        .replace('- ', '');

                const images = Array.from(document
                    .querySelectorAll(chapterSelector.images))
                    .map(src => {
                        let attr = src.getAttribute("data-z");
                        while (attr.startsWith('/')) {
                            attr = attr.replace('/', '');
                        }

                        if (attr.startsWith('http://')) {
                            attr = attr.replace('http://', 'https://cm.cloudblaze.org/');
                        }

                        if (!attr.startsWith('https://')) {
                            attr = 'https://cm.cloudblaze.org/' + attr;
                        }

                        return attr;
                    });

                const url = chapterUrl;

                const storyUrl = document
                    .querySelector(chapterSelector.storyUrl)
                    .getAttribute('href');

                return { chapter: { chap: chap, images: images, url: url, status: 1 }, storyUrl: storyUrl };
            }, chapterSelector, chapterUrl);

            const chapter = await updateChapter(extractedData.chapter);

            if (!chapter) {
                await makeBrowserPending(browser, page);
                reject(false);
            }

            let storyId = null;
            if (isNew) {
                storyId = chapter.story_id;
            }
            // else {
            //     let story = await findStory(extractedData.storyUrl);
            //     if (story == []) {
            //         story = await CrawlStory(browser, extractedData.storyUrl, true);
            //     }

            //     if (!story) {
            //         storyId = Math.random(100000000, 999999999);
            //     } else {
            //         storyId = story[0]._id.toString();
            //     }
            // }

            const dir = initImageStorage(storyId, chapter._id.toString());

            let i = 0;
            extractedData.chapter.images.forEach(async url => {
                if (url) {
                    const path = dir + '/' + ++i + '.jpg';
                    await downloadImage(url, path, (error) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                };
            });

            await makeBrowserPending(browser, page);
            resolve(chapter);
        } catch (error) {
            console.log(error);
            await makeBrowserPending(browser, page);
            reject(false);
        }
    })
};

module.exports = { crawlPage, CrawlStory, crawlChapter };
