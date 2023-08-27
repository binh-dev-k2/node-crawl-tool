const express = require("express");
const crawl = require('../controller/crawlController');

const router = express.Router();

router.route('/').post(crawl.crawl);
router.route('/crawl-story').post(crawl.crawlStories);
router.route('/crawl-chapter').post(crawl.crawlChapters);

module.exports = router;
