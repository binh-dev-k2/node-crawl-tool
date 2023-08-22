const fs = require('fs')
const axios = require('axios');
const config = require('../config/config');

const options = {
    headers: { referer: config.host },
    responseType: 'arraybuffer'
};

const downloadImg = async (url, destination, callback) => {
    try {
        const response = await axios.get(url, options);

        fs.writeFile(destination, response.data, (error) => {
            if (error) {
                callback('Đã xảy ra lỗi khi tải ảnh:', error);
            } else {
                callback('Ảnh đã được tải về thành công!');
            }
        });

        return true;
    } catch (error) {
        callback('Đã xảy ra lỗi khi tải ảnh:', error);

        return false;
    }

};

module.exports = { downloadImg }
