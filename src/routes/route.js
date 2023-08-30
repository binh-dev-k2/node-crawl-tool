const express = require("express");
const crawl = require('../controller/crawlController');

const router = express.Router();

router.route('/crawl').post(crawl.crawl);
router.route('/crawl-story').post(crawl.crawlStories);
router.route('/crawl-chapter').post(crawl.crawlChapters);
router.route('/crawl-test').post(crawl.crawlllll);

module.exports = router;
