const Chapter = require("../models/mongo/Chapter");


const insertChapter = async (chapter) => {
    try {
        return Chapter(chapter).save();
    } catch (error) {
        console.error(error);
        return false;
    }
}

const insertChapters = async (chapters) => {
    try {
        for (const chapter of chapters) {
            await insertChapter(chapter);
        }
        // await Chapter.insertMany(chapters);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

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

const findChapters = async (storyId) => {
    try {
        return await Chapter.find({ story_id: storyId }).exec();
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getUncrawledChapters = async () => {
    try {
        return await Chapter.find({ status: 0 }).exec();
    } catch (error) {
        console.log(err);
        return false;
    }
}

module.exports = { insertChapter, insertChapters, updateChapter, updateChapters, getUncrawledChapters, findChapters };
