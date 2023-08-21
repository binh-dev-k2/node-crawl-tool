const express = require("express");
const crawl = require('../controller/crawl')

const router = express.Router();

router.route('/').post(crawl.crawlStory);

module.exports = router;
