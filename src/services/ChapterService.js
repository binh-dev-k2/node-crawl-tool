const Chapter = require("../models/mongo/Chapter");

const insertChapter = async (chapters) => {
    try {
        // const promises = chapters.map(async (chapter) => {
        //     await new Chapter(chapter).save();
        // });
        // await Promise.all(promises);

        // return true;
        return await Chapter.insertMany(chapters);
    } catch (error) {
        console.error(error);
        return false;
    }
}

const updateChapter = async (chapter) => {
    const query = { url: chapter.url };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
        return await Chapter.findOneAndUpdate(query, chapter, options);
    } catch (error) {
        console.error(error);
        await Chapter.findOneAndUpdate(query, { status: 2 }, options);
        return false;
    }
}

const updateChapters = async (chapters) => {
    try {
        for (const chapter of chapters) {
            await updateChapter(chapter);
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getUncrawlerChapters = async () => {
    try {
        return await Chapter.find({ status: 0 }).exec();
    } catch (error) {
        console.log(err);
        return false;
    }
}

module.exports = { insertChapter, updateChapter, updateChapters, getUncrawlerChapters };
