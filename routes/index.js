var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
   var dir = __dirname;
   var dirname = dir.replace('routes', 'public');

   res.sendFile(dirname + '/htmls/index.html');
});


module.exports = router;
