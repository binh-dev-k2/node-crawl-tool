require('dotenv').config();

const env = process.env;

const config = {
    app: {
        port: env.PORT,
        name: 'crawler'
    },
    mongodb: {
        host: env.MONGODB_HOST,
        port: env.MONGODB_PORT,
        name: env.MONGODB_NAME
    },
    mysql: {
        host: env.MYSQL_HOST,
        user: env.MYSQL_USERNAME,
        password: env.MYSQL_PASSWORD,
        name: env.MYSQL_NAME
    },
    headless: env.HEADLESS,
    numberBrowser: env.NUMBER_BROWSER,
    process: env.NODE_ENV,
    nettruyenHost: env.NETTRUYEN_HOST,
    pageSelector: {
        container: env.PAGE_CONTAINER,
        url: env.PAGE_URL
    },
    storySelector: {
        title: env.STORY_TITLE,
        thumbnail: env.STORY_THUMBNAIL,
        author: env.STORY_AUTHOR,
        description: env.STORY_DESCRIPTION
    },
    chapterSelector: {
        storyUrl: env.CHAPTER_STORY_URL,
        container: env.CHAPTER_CONTAINER,
        // chap: '#ctl00_divCenter > div > div:nth-child(1) > div.top > h1 > span',
        chap: env.CHAPTER_CHAP,
        images: env.CHAPTER_IMAGES
    }
}

module.exports = config;
