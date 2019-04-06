
// require express
var express = require('express');
var path = require('path');

// create the router object 
var router = express.Router();

// export the router object 
module.exports = router;


// route our app
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../index.html'));
  });