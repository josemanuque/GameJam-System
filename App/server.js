const express = require('express');
const path = require('path');
const app = express();

// Serve Static Files
app.use(express.static(path.join(__dirname, 'dist/app/browser')));

// Get Main Page of Angular App
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/app/browser/index.html'));
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Static express hearing on port ${PORT}`);
});