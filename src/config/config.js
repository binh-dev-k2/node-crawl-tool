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
    numberBrowser: 3,
    process: 'development',
    host: 'https://www.nettruyenmax.com/'
}

module.exports = config;
