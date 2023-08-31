const Story = require("../models/mongo/Story");

const insertStory = async (story) => {
    try {
        return Story(story).save();
    } catch (error) {
        console.error(error);
        return false;
    }
}

const insertStories = async (stories) => {
    try {
        for (const story of stories) {
    console.log(story);

            await insertStory(story);
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const updateStory = async (story) => {
    const query = { url: story.url };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
        return await Story.findOneAndUpdate(query, story, options);
    } catch (error) {
        await Story.findOneAndUpdate(query, { status: 2 }, options);
        return false;
    }
}

const updateStories = async (stories) => {
    try {
        for (const story of stories) {
            await updateStory(story);
        }

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const findStory = async (url) => {
    try {
        return await Story.find({ url: url }).exec();
    } catch (error) {
        console.error(error);
        return false;
    }
}

const getUncrawledStories = async () => {
    try {
        return await Story.find({ status: 0 }).exec();
    } catch (error) {
        console.log(err);
        return false;
    }
}

module.exports = { insertStory, insertStories, updateStory, updateStories, getUncrawledStories, findStory };
