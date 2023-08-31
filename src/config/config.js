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
        storyContainer: env.PAGE_STORY_CONTAINER,
        storyItem: env.PAGE_STORY_ITEM,
        storyUrl: env.PAGE_STORY_URL
    },
    storySelector: {
        title: env.STORY_TITLE,
        thumbnail: env.STORY_THUMBNAIL,
        author: env.STORY_AUTHOR,
        description: env.STORY_DESCRIPTION,
        chapterContainer: env.STORY_CHAPTER_CONTAINER,
        chapterItem: env.STORY_CHAPTER_ITEM,
        chapterUrl: env.STORY_CHAPTER_URL
    },
    chapterSelector: {
        imageContainer: env.CHAPTER_IMAGE_CONTAINER,
        imageItem: env.CHAPTER_IMAGE_ITEM,
        imageUrl: env.CHAPTER_IMAGE_URL,
        storyUrl: env.CHAPTER_STORY_URL
    }
}

module.exports = config;
