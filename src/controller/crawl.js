const puppeteer = require("puppeteer-extra");
const { regexUrl } = require("../utils/url");
const { headless } = require("../config/config");
const Story = require("../models/mongo/Story");
const Chapter = require("../models/mongo/Chapter");
const config = require("../config/config");
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

            const story = await saveStory(extractedData.story);
            const storyId = story._id;

            const chaptersWithStoryId = extractedData.chapters.map(link => ({
                link: link,
                story_id: storyId,
                chap: '',
                images: [],
                status: 0,
            }));
            await browser.close();

            await saveChapters(chaptersWithStoryId);
            await initBrowser();

            let listChapters = [];
            await Chapter.find({ status: 0 }).exec().then((result) => {
                listChapters = result
            }).catch((err) => {
                console.log(err);
            });;


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
                        if (src.getAttribute("src") === 'https://nettruyenhd.com/images/current-site.webp') {
                            return null;
                        }

                        return src.getAttribute("src");
                    });

                return { chap, images };
            });

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
    listBrowser.forEach(browser => {
        browser.browser.close();
    });
}

const saveStory = async ({ title, thumbnail, url, author, description }) => {
    try {
        return await Story({
            title: title,
            thumbnail: thumbnail,
            url: url,
            author: author,
            description: description
        }).save();
    } catch (error) {
        console.error(error);
        return false;
    }
};

const saveChapters = async (chapters) => {
    try {
        return await Chapter.insertMany(chapters);
    } catch (error) {
        console.error(error);
        return false;
    }
}

const updateChapter = async (chapterId, { chap, images }) => {
    try {
        return await Chapter.findOneAndUpdate(
            { _id: chapterId },
            { chap: chap, images: images, status: 1 }
        );
    } catch (error) {
        console.error(error);
        await Chapter.findOneAndUpdate({ _id: chapterId }, { status: 2 })
        return false;
    }
}

module.exports = { crawlStory };
