const regexUrl = (url) => {
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
        url = 'https://' + url;
    }
    return url;
}

module.exports = { regexUrl };
