const app = require('./app');
const PORT = 8000;

// INITIALIZE SERVER AT PORT 8000
app.listen(PORT, () => {
    console.log('Server launched and listening on port 8000');
});