const app = require('./app');
const config = require('./src/config/config');

app.listen(config.app.port || 3333, () => {
    console.log(`Server is running on port ${config.app.port} 📍 🎆`);
});
