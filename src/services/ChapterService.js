const Chapter = require("../models/mongo/Chapter");

const insertChapter = async (chapters) => {
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
        const promises = chapters.map(async (chapter) => {
            await Chapter.findOneAndUpdate({ link: chapter.link }, chapter, options);
        });
        await Promise.all(promises);

        return true;
        // return await Chapter.insertMany(chapters);
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

const getUncrawlerChapter = async () => {
    try {
        return await Chapter.find({ status: 0 }).exec();
    } catch (error) {
        console.log(err);
        return false;
    }
}

module.exports = { insertChapter, updateChapter, getUncrawlerChapter };
