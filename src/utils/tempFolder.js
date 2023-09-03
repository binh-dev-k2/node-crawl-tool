const fs = require('fs');
const os = require("os");
const path = require("path");

const tempDir = os.tmpdir(); // /temp 

const deletePuppeteerFolders = async () => {
    try {
        const files = await fs.promises.readdir(tempDir);
        for (const file of files) {
            const filePath = path.join(tempDir, file);
            const stats = await fs.promises.stat(filePath);
            if (stats.isDirectory() && file.includes('puppeteer')) {
                await fs.promises.rmdir(filePath, { recursive: true });
                console.log(`Đã xóa thư mục ${ filePath }`);
            }
        }
    } catch (err) {
        console.error('Lỗi khi thực hiện:', err);
    };
};

module.exports = { deletePuppeteerFolders };