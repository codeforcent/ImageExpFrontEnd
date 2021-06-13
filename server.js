//Install express server
const express = require('express');
const app = express();
const path = require('path');



// // Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/draw-ex'));
app.listen(process.env.PORT || 8080);
app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname + '/dist/draw-ex/index.html'))
);
let port = process.env.PORT || 8080;
// Start the app by listening on the default Heroku port