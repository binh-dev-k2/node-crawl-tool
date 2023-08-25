const fs = require('fs')
const axios = require('axios');
const config = require('../config/config');

const options = {
    headers: { referer: config.host },
    responseType: 'arraybuffer',
    timeout: 30000,
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

        fs.writeFile(destination, response.data, (error) => {
            if (error) {
                callback(`Đã xảy ra lỗi khi tải ảnh ${destination} : ${error}`);
            } else {
                callback(`Ảnh ${destination} đã được tải về thành công!`);
            }
        });

        return true;
    } catch (error) {
        callback(`Đã xảy ra lỗi khi tải ảnh ${destination} : ${error}`);

        return false;
    }

};

module.exports = { initImageStorage, downloadImage }
