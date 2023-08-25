const config = {
    app: {
        port: 3000,
        name: 'crawler'
    },
    mongodb: {
        host: '127.0.0.1',
        port: 27017,
        name: 'crawler'
    },
    mysql: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'crawler'
    },
    headless: false,
    numberBrowser: 5,
    process: 'development',
    host: 'https://www.nettruyenmax.com/',
    pageSelector: {
        container: '#ctl00_divCenter > div > div > div.items > div.row div.item',
        url: 'figure > figcaption > h3 > a'
    },
    storySelector: {
        title: '#item-detail > h1',
        thumbnail: '#item-detail > div.detail-info > div > div.col-xs-4.col-image > img',
        author: '#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.author.row > p.col-xs-8',
        description: 'No infomation'
    },
    chapterSelector: {
        container: '#nt_listchapter > nav > ul > li > div.col-xs-5.chapter > a',
        chap: '#ctl00_divCenter > div > div:nth-child(1) > div.top > h1 > span',
        images: '.reading-detail .page-chapter > img'
    }
}

module.exports = config;
