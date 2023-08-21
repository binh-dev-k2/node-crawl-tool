const config = require('./src/config/config')
const app = require('./app')

app.listen(config.app.port || 3333, () => {
    console.log(`Server is running on port ${config.app.port} 📍 🎆`);
});


