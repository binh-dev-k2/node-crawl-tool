const regexUrl = async (url) => {
    if (url.startsWith('//')) {
        url = url.replace('//', '');
    }

    if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
    }

    if (!url.startsWith('https://')) {
        url = 'https://' + url;
    }

    return url;
}

module.exports = { regexUrl };
