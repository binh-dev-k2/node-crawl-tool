const { regexUrl } = require("../utils/url");
const { downloadImage, initImageStorage } = require("../utils/images");
const { insertChapter, updateChapter, updateChapters } = require("../services/ChapterService");
const { insertStory, updateStory, updateStories, findStory } = require("../services/StoryService");
const { makeBrowserPending } = require("../utils/browsers");
const config = require("../config/config");

const pageSelector = config.pageSelector
const storySelector = config.storySelector;
const chapterSelector = config.chapterSelector;

const crawlPage = async (browser, pageUrl, isNew = false) => {
    const page = await browser.browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
    await page.waitForTimeout(1000);

    return new Promise(async (resolve, reject) => {
        try {
            const extractedData = await page.evaluate((pageSelector) => {
                const stories = Array
                    .from(document.querySelectorAll(pageSelector.container))
                    .map(story => {
                        return {
                            url: story.querySelector(pageSelector.url).getAttribute('href'),
                            status: 0
                        }
                    });

                return stories;
            }, pageSelector);

            const stories = isNew ? await updateStories(extractedData) : await updateStories(extractedData);

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
    await page.goto(storyUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
    await Promise.all([
        page.waitForNavigation('#challenge-stage > div > label > input[type=checkbox]', { timeout: 300000 }),
        // page.click('#challenge-stage > div > label > input[type=checkbox]', { timeout: 30000 }),
    ]);

    await page.waitForSelector('#ctl00_divCenter');

    return new Promise(async (resolve, reject) => {
        try {
            const extractedData = await page.evaluate((storyUrl, storySelector, chapterSelector) => {
                const title = document
                    .querySelector(storySelector.title)
                    .textContent;

                const thumbnail = document
                    .querySelector(storySelector.thumbnail)
                    .getAttribute("src")
                    .replace("//", "https://");

                const author = document
                    .querySelector(storySelector.author)
                    .textContent;

                const description = storySelector.description;

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
    await page.goto(chapterUrl, { waitUntil: 'domcontentloaded', timeout: 0 });
    // await Promise.all([
    //     page.waitForNavigation('#challenge-stage > div > label > input[type=checkbox]', { timeout: 300000 }),
    //     page.click('#challenge-stage > div > label > input[type=checkbox]'),
    // ])
    // await page.waitForTimeout(1000);

    return new Promise(async (resolve, reject) => {
        try {
            const extractedData = await page.evaluate((chapterSelector, chapterUrl) => {
                const chap = document
                    .querySelector(chapterSelector.chap)
                    .textContent
                    .replace('- ', '');

                const images = Array.from(document
                    .querySelectorAll(chapterSelector.images))
                    .map(src => src.getAttribute("src").replace('//', 'https://'));

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
            } else {
                let story = await findStory(extractedData.storyUrl);
                if (story == []) {
                    story = await CrawlStory(browser, extractedData.storyUrl, true);
                }

                if (!story) {
                    storyId = Math.random(100000000, 999999999);
                } else {
                    storyId = story[0]._id.toString();
                }
            }

            const dir = initImageStorage(storyId, chapter._id.toString());

            let i = 0;
            extractedData.chapter.images.forEach(async url => {
                if (url) {
                    const path = dir + '/' + ++i + '.jpg';
                    const isSuccess = await downloadImage(url, path, (error) => {
                        if (error) {
                            console.log(error);
                            return false;
                        }
                        return true;
                    });

                    if (!isSuccess) {
                        await downloadImage(url, path, async (error) => {
                            if (error) {
                                console.log(error);
                                await makeBrowserPending(browser, page);
                                reject("Co loi xay ra ne: " + error);
                            } else {
                                console.log('done');
                            }
                        });
                    }
                }
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
