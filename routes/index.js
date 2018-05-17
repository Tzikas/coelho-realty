var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', home:true});
})


router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About'});
})

router.get('/featured', function(req, res, next) {
  res.render('featured', { title: 'Featured'});
})


router.get('/', function(req, res, next) {
  res.render('results', { title: 'Results'});
})





/*
request('https://idx.mlspin.com/details.asp?mls=72282008&aid=CN211748',

  function(err, resp, html) {
          if (!err){
                    const $ = cheerio.load(html);
                              console.log(html); 
                      res.render('index', { title: 'Express', html:html });

          }
  });

});
*/



module.exports = router;
