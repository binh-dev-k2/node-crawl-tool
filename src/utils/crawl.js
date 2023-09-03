const { regexUrl } = require("../utils/url");
const { downloadImage, initImageStorage, downloadImages } = require("../utils/images");
const { updateChapter, updateChapters, insertChapters, insertChapter } = require("../services/ChapterService");
const { insertStory, updateStory, updateStories, findStory, insertStories } = require("../services/StoryService");
const { makeBrowserPending } = require("../utils/browsers");
const config = require("../config/config");
let userAgent = require('user-agents');

const pageSelector = config.pageSelector
const storySelector = config.storySelector;
const chapterSelector = config.chapterSelector;

const crawlPage = async (browser, pageUrl, isNew = false) => {
    browser.on('disconnected', () => {
        console.log('Trình duyệt đã bị đóng.');
        // Thực hiện các xử lý bổ sung hoặc thông báo lỗi tại đây
        return false;
    });
    const page = await browser.browser.newPage();
    await page.setUserAgent(userAgent.random().toString());
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (
            req.resourceType() === 'image'
            || req.resourceType() === 'stylesheet'
            || req.resourceType() === 'font'
            || req.resourceType() === 'script'
        ) {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    try {
        await page.goto(pageUrl, { waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 0 });
        await page.waitForSelector(pageSelector.storyContainer);
    } catch (error) {
        console.error(error);
        await makeBrowserPending(browser, page);
        return false;
    }

    return new Promise(async (resolve, reject) => {
        try {
            const extractedData = await page.evaluate(async (pageSelector) => {
                const pageContainer = document.querySelector(pageSelector.storyContainer);
                const listStories = Array.from(pageContainer.querySelectorAll(`${pageSelector.storyItem} ${pageSelector.storyUrl}`));
                const stories = await Promise.all(
                    listStories.map(async (item) => {
                        const url = item.getAttribute('href') || "null";
                        return {
                            url: url,
                            status: 0
                        }
                    })
                );

                return stories;
            }, pageSelector);

            const stories = isNew ? await updateStories(extractedData) : await updateStories(extractedData);

            await makeBrowserPending(browser, page);
            if (!stories) {
                reject(false);
            }

            resolve(true);
        } catch (error) {
            console.error(error);
            await makeBrowserPending(browser, page);
            reject(false);
        }
    });
};

const CrawlStory = async (browser, storyUrl, isNew = false) => {
    const page = await browser.browser.newPage();
    await page.setUserAgent(userAgent.random().toString());
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (
            req.resourceType() === 'image'
            || req.resourceType() === 'stylesheet'
            || req.resourceType() === 'font'
            || req.resourceType() === 'script'
        ) {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    try {
        await page.goto(storyUrl, { waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 0 });
        await page.waitForSelector(storySelector.chapterContainer);
        await page.exposeFunction("regexUrl", regexUrl);
    } catch (error) {
        console.error(error);
        await makeBrowserPending(browser, page);
        return false;
    }

    return new Promise(async (resolve, reject) => {
        try {
            const extractedData = await page.evaluate(async (storyUrl, storySelector) => {
                const title = (document.querySelector(storySelector.title))?.textContent || "null";
                const author = (document.querySelector(storySelector.author))?.textContent || "null";
                let thumbnail = (document.querySelector(storySelector.thumbnail))?.getProperty("src") || "null";
                thumbnail = await window.regexUrl(thumbnail);
                let description = storySelector.description;

                const storyContainer = document.querySelector(storySelector.chapterContainer);
                const listChapters = Array.from(storyContainer.querySelectorAll(`${storySelector.chapterItem} ${storySelector.chapterUrl}`));
                const chapters = await Promise.all(
                    listChapters.map(async (item) => {
                        const chap = item.textContent;
                        const url = await window.regexUrl(item.getAttribute("href")) || "null";
                        
                        return {
                            chap: chap,
                            url: url
                        };
                    })
                );

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
            }, storyUrl, storySelector);

            const story = isNew ? await insertStory(extractedData.story) : await updateStory(extractedData.story);

            if (!story) {
                await makeBrowserPending(browser, page);
                reject(false);
            }

            const storyId = story._id;
            const data = extractedData.chapters.map(chapter => {
                return {
                    chap: chapter.chap,
                    url: chapter.url,
                    story_id: storyId,
                    status: 0,
                }
            });

            const chapters = isNew ? await insertChapters(data) : await updateChapters(data);

            await makeBrowserPending(browser, page);
            if (!chapters) {
                reject(false);
            }

            resolve(story);
        } catch (error) {
            console.error(error);
            await makeBrowserPending(browser, page);
            reject(false);
        }
    });
};

const crawlChapter = async (browser, chapterUrl, isNew = false) => {
    const page = await browser.browser.newPage();
    // await page.setUserAgent(userAgent.random().toString());
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (
            req.resourceType() === 'image'
            || req.resourceType() === 'stylesheet'
            || req.resourceType() === 'font'
            || req.resourceType() === 'script'
        ) {
            req.abort();
        }
        else {
            req.continue();
        }
    });

    try {
        await page.goto(chapterUrl, { waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 0 });
        await page.waitForSelector(`${chapterSelector.imageContainer}`);
        // await autoScroll(page);
        await page.exposeFunction("regexUrl", regexUrl);
    } catch (error) {
        console.error(error);
        await makeBrowserPending(browser, page);
        return false;
    }

    return new Promise(async (resolve, reject) => {
        try {
            const extractedData = await page.evaluate(async (chapterSelector, chapterUrl) => {
                const chapterContainer = document.querySelector(chapterSelector.imageContainer);
                const listImages = Array.from(chapterContainer.querySelectorAll(`${chapterSelector.imageItem} ${chapterSelector.imageUrl}`));
                const images = await Promise.all(
                    listImages.map(async (item) => await regexUrl(item.getAttribute('data-original')))
                );

                let storyUrl = document.querySelector(chapterSelector.storyUrl)
                storyUrl = storyUrl ? await window.regexUrl(storyUrl.getAttribute('href')) : "null";

                const url = chapterUrl;

                return { chapter: { images: images, url: url, status: 1 }, storyUrl: storyUrl };
            }, chapterSelector, chapterUrl);

            const chapter = isNew
                ? await insertChapter(extractedData.chapter)
                : await updateChapter(extractedData.chapter);

            if (!chapter) {
                await makeBrowserPending(browser, page);
                reject(false);
            }

            let storyId = null;
            if (isNew) {
                storyId = chapter.story_id;
            } else {
                let story = await findStory(extractedData.storyUrl);
                if (story.length === 0) {
                    story = await CrawlStory(browser, extractedData.storyUrl, true);
                };

                if (!story) {
                    storyId = Math.floor(Math.random() * (999999999 - 100000000 + 1) + 100000000);
                } else {
                    storyId = story[0]._id.toString();
                };
            };

            const dir = initImageStorage(storyId, chapter._id.toString());
            await downloadImages(extractedData.chapter.images, dir);
            await makeBrowserPending(browser, page);
            resolve(chapter);
        } catch (error) {
            console.log(error);
            await makeBrowserPending(browser, page);
            reject(false);
        }
    })
};

const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            let distance = 300;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 300);
        });
    });
}

module.exports = { crawlPage, CrawlStory, crawlChapter };
