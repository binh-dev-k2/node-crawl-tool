const fs = require('fs');

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

module.exports = { initImageStorage };
