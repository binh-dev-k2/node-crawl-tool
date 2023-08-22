const puppeteer = require("puppeteer-extra");
const { regexUrl } = require("../utils/url");
const { headless } = require("../config/config");
const config = require("../config/config");
const { downloadImg } = require("../utils/downloadImg");
const { initImageStorage } = require("../utils/storage");
const { insertChapter, updateChapter, getUncrawlerChapter } = require("../services/ChapterService");
const { insertStory } = require("../services/StoryService");

let listBrowser = [];

const crawlStory = async (req, res) => {
    const browser = await puppeteer.launch({
        headless: headless,
        args: ["--no-sandbox"],
    });

    try {
        const url = await req.body.url;
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForTimeout(1000);

        return new Promise(async (resolve, reject) => {
            const extractedData = await page.evaluate((url) => {
                const title = document.querySelector("#item-detail > h1").textContent;

                const thumbnail = document
                    .querySelector(
                        "#item-detail > div.detail-info > div > div.col-xs-4.col-image > img"
                    )
                    .getAttribute("src")
                    .replace("//", "/");
                const author = document.querySelector("#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.author.row > p.col-xs-8").textContent;

                const description = "hihi";

                const chapters = Array.from(
                    document.querySelectorAll('#nt_listchapter > nav > ul > li > div.col-xs-5.chapter > a'))
                    .map(href =>
                        href.getAttribute("href")
                    );

                return {
                    story: { title, thumbnail, url, author, description },
                    chapters: chapters
                };
            }, url);

            const story = await insertStory(extractedData.story);
            if (!story) {
                reject("Link da ton tai trong db");
            }

            const storyId = story._id;
            const chaptersWithStoryId = extractedData.chapters.map(link => ({
                link: link,
                story_id: storyId,
                chap: '',
                images: [],
                status: 0,
            }));

            await browser.close();
            await insertChapter(chaptersWithStoryId);
            await initBrowser();

            let listChapters = await getUncrawlerChapter() || [];
            console.log(listChapters);

            while (listChapters.length) {
                const browser = await getBrowser();
                if (browser) {
                    const chapter = listChapters.shift();
                    crawlChapter(browser, chapter);
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            closeAllBrowser();
            res.status(200).send(listChapters);
            resolve(listChapters);
        })
    } catch (error) {
        console.error(error);
        await browser.close();
        res.status(500).send("Internal Server Error");
    }
};

const crawlChapter = async (browser, chapter) => {
    try {
        const page = await browser.browser.newPage();
        await page.goto(chapter.link);
        await page.waitForTimeout(1000);

        return new Promise(async (resolve, reject) => {
            const extractedData = await page.evaluate(() => {
                const chap = document.querySelector('#ctl00_divCenter > div > div:nth-child(1) > div.top > h1 > span').textContent
                const images = Array.from(
                    document.querySelectorAll('.reading-detail .page-chapter > img'))
                    .map(src => {
                        return src.getAttribute("src").replace('//', 'https://');
                    });

                return { chap, images };
            });

            const dir = initImageStorage(chapter.story_id, chapter._id);

            let i = 0
            extractedData.images.forEach(url => {
                if (url) {
                    const path = dir + '/' + ++i + '.jpg';
                    downloadImg(url, path, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('done');
                        }
                    });
                }
            })

            const chapterResult = await updateChapter(chapter._id, extractedData);

            await page.close();
            browser.status = 0;
            resolve(chapterResult);
        })
    } catch (error) {
        console.error(error);
        browser.status = 0;
    }
}

const initBrowser = async () => {
    if (listBrowser.length === 0) {
        for (let i = 1; i <= config.numberBrowser; i++) {
            const browser = await puppeteer.launch({
                headless: config.headless,
                args: ["--no-sandbox", '--disable-features=site-per-process'],
            });
            listBrowser.push({ status: 0, browser: browser });
        }
    }
    return true;
}

const getBrowser = async () => {
    let browser = listBrowser.find(e => e.status === 0);
    if (browser) {
        browser.status = 1;
        return browser;
    } else {
        return false;
    }
}

const closeAllBrowser = async () => {
    while (listBrowser.find(e => e.status === 1)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    listBrowser.forEach(browser => {
        browser.browser.close();
    });
}

module.exports = { crawlStory };
