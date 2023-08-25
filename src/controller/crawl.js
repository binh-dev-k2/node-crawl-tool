const { regexUrl } = require("../utils/url");
const config = require("../config/config");
const { downloadImage, initImageStorage } = require("../utils/images");
const { insertChapter, updateChapter, getUncrawlerChapters, updateChapters } = require("../services/ChapterService");
const { insertStory, updateStory, updateStories, getUncrawlerStories } = require("../services/StoryService");
const { initBrowser, getBrowser, clearBrowser, makeBrowserPending, checkAllBrowserPending } = require("../utils/browsers");

let browsers = [];
const pageSelector = config.pageSelector
const storySelector = config.storySelector
const chapterSelector = config.chapterSelector

const crawl = async (req, res) => {
    await initBrowser(browsers);
    let browser = null;
    let i = 0;

    while (i++ < 1) {
        browser = await getBrowser(browsers);

        try {
            if (browser) {
                const pageUrl = config.host + '?page=' + i;
                console.log(i);
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

    await checkAllBrowserPending(browsers);

    let uncrawledStories = await getUncrawlerStories() || [];
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

    await checkAllBrowserPending(browsers);

    let uncrawledChapters = await getUncrawlerChapters() || [];
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

    return true;
}

const crawlPage = async (browser, pageUrl, isNew = false) => {
    const page = await browser.browser.newPage();
    await page.goto(pageUrl, { waitUntil: 'load', timeout: 0 });
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
                reject("Co loi xay ra");
            }

            await makeBrowserPending(browser, page);
            resolve(true);
        } catch (error) {
            console.error(error);
            await makeBrowserPending(browser, page);
            reject("Co loi xay ra: " + error.message);
        }
    });
}

const CrawlStory = async (browser, storyUrl, isNew = false) => {
    const page = await browser.browser.newPage();
    await page.goto(storyUrl, { waitUntil: 'load', timeout: 0 });
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
                reject("Co loi xay ra");
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
                reject("Co loi xay ra");
            }

            await makeBrowserPending(browser, page);
            resolve(true);
        } catch (error) {
            
            console.error(error);
            await makeBrowserPending(browser, page);
            reject("Co loi xay ra: " + error.message);
        }
    })
}

const crawlChapter = async (browser, chapterUrl) => {
    const page = await browser.browser.newPage();
    await page.goto(chapterUrl, { timeout: 0 });
    // await page.waitForSelector('div.reading-detail.box_doc')
    await page.waitForTimeout(1000);

    return new Promise(async (resolve, reject) => {
        try {
            const extractedData = await page.evaluate((chapterSelector, chapterUrl) => {
                const chap = document
                    .querySelector(chapterSelector.chap)
                    .textContent

                const images = Array.from(
                    document
                        .querySelectorAll(chapterSelector.images))
                    .map(src => src.getAttribute("src").replace('//', 'https://'));

                const url = chapterUrl;

                return { chap: chap, images: images, url: url, status: 1 };
            }, chapterSelector, chapterUrl);

            const chapter = await updateChapter(extractedData);

            if (!chapter) {
                await makeBrowserPending(browser, page);
                reject("Co loi xay ra");
            }

            const dir = initImageStorage(chapter.story_id, chapter._id.toString());

            let i = 0;
            extractedData.images.forEach(url => {
                if (url) {
                    const path = dir + '/' + ++i + '.jpg';
                    downloadImage(url, path, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('done');
                        }
                    });
                }
            });

            await makeBrowserPending(browser, page);
            resolve(true);
        } catch (error) {
            await makeBrowserPending(browser, page);
            reject("Co loi xay ra: " + error.message);
        }
    })
};

module.exports = { crawl, crawlPage, CrawlStory, crawlChapter };
