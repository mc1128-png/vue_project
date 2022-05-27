const express = require("express")
const app = express()
const path = require('path')
const router = require('./router.js')
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')));
app.use(router);

app.listen(3000, () => {
    console.log("服务器已经启动")
})