const Story = require("../models/mongo/Story");


const insertStory = async ({ title, thumbnail, url, author, description }) => {
    const query = { url: url };

    const update = {
        title: title,
        thumbnail: thumbnail,
        url: url,
        author: author,
        description: description
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
        return await Story.findOneAndUpdate(query, update, options);
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = { insertStory };
