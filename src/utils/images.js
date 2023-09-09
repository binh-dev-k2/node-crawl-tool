const fs = require('fs')
const axios = require('axios');
const https = require("https");
const config = require('../config/config');

const options = {
    headers: {
        referer: config.nettruyenHost
    },
    // responseType: 'stream',
    responseType: 'arraybuffer',
    timeout: 100000,
    httpsAgent: new https.Agent({ keepAlive: true }),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
};

const initImageStorage = (storyId, chapterId) => {
    const root = './src/storage/images';
    if (!fs.existsSync(root)) {
        fs.mkdirSync(root);
    }

    const storyDir = `${root}/${storyId}`
    if (!fs.existsSync(storyDir)) {
        fs.mkdirSync(storyDir);
    }

    const chapterDir = `${storyDir}/${chapterId}`
    if (!fs.existsSync(chapterDir)) {
        fs.mkdirSync(chapterDir);
    }

    return chapterDir;
}

const downloadImage = async (url, destination, callback) => {
    try {
        const response = await axios.get(url, options);

        await fs.promises.writeFile(destination, response.data);
        return `Ảnh ${destination} đã được tải về thành công!`;


        // const writer = fs.createWriteStream(destination);
        // await response.data.pipe(writer);
        // writer.on('finish', () => {
        //     callback(`Ảnh ${url} đã được tải về thành công!`);
        // });
        // writer.on('error', (error) => {
        //     callback(`Đã xảy ra lỗi khi tải ảnh ${url} : ${error}`);
        // });

        // return true;
    } catch (error) {
        if (error.response) {
            throw `Đã xảy ra lỗi khi tải ảnh ${url}: ${error.response.statusText}`;
        } else if (error.code === 'ECONNABORTED') {
            throw `Đã xảy ra lỗi kết nối khi tải ảnh ${url}: Thời gian chờ đã vượt quá giới hạn`;
        } else if (error.code === 'ENOTFOUND') {
            throw `Đã xảy ra lỗi kết nối khi tải ảnh ${url}: Không tìm thấy địa chỉ máy chủ`;
        } else {
            throw `Đã xảy ra lỗi khi tải ảnh ${url}: ${error.message}`;
        }
    }
};

const downloadImages = async (urls, dir) => {
    try {
        const promises = urls.map(async (url, index) => {
            const path = `${dir}/${index + 1}.jpg`;
            return await downloadImage(url, path);
        });
        const results = await Promise.all(promises);
        results.forEach(result => console.log(result));
    } catch (error) {
        console.log(error);
    }
};

module.exports = { initImageStorage, downloadImage, downloadImages }
