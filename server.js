//Install express server
const express = require('express');
const path = require('path');

const app = express();


let port = process.env.PORT || 8000;
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8000);