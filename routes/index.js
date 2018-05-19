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



router.get('/results', function(req, res, next) {
  
  console.log('params ', req.query)
  let params = req.query; 

  var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

  console.log( queryString ) 

  request(`https://idx.mlspin.com/rslts.asp?${queryString}`,
  function(err, resp, html) {
      if (!err){
        const $ = cheerio.load(html);
        //console.log(html);
        //
        let url; 
        $('.idx').attr('href', function(i, currentValue){
          url = currentValue 
          return 'details/' + currentValue;
        });

        $('.ResultsHeading .idx, .ResultsHeading strong').attr('href', function(i, currentValue){
          return url.replace('rslts.asp', 'results').replace('currentpage=5','currentpage='+(i+1));
        });
        
      
        $('img').attr('src', function(i, currentValue){
          currentValue = currentValue.replace('w=96&h=75','w=296&h=275')
          $(this).attr('width', 150)
          $(this).attr('height', 150)
          
          return 'https://idx.mlspin.com' + currentValue;
        });
        $('.ResultsHeading img').remove()


        //$('td[valign=middle][colspan=6]').append('<hr>')
        //html = $.html().replace(/<(?!hr|img|a\s*\/?)[^>]+>/g, '');
        //console.log(html)

        $('td, tr, table').each(function() {      // iterate over all elements
          //this.attribs = {};     // remove all attributes
        });
        //$('td, tr, table').contents().unwrap();
        
        $('link[rel=stylesheet]').remove();
        $('td[align=center][valign=middle]').remove()
        //$('td[align=center]').remove()

        res.render('results', { title: 'Results', html:$.html(), results:true });
      }
    });
});


router.get('/details/:params', function(req, res, next) {
    console.log('dont get it')
  
  console.log(req.query, req.params)
  let params = req.query; 

  var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

  console.log( queryString ) 
  request(`https://idx.mlspin.com/details.asp?${queryString}`,
  function(err, resp, html) {
      if (!err){
        const $ = cheerio.load(html);

        
        $('img').attr('src', function(i, currentValue){
          return 'https://idx.mlspin.com/' + currentValue;
        });

        $('td, tr, table').each(function() {      // iterate over all elements
          //this.attribs = {};     // remove all attributes
        });
        $('link[rel=stylesheet]').remove();

        //console.log(html); 
        res.render('details', { title: 'Details', html:$.html(), results:true });
      }
    });
    

})


/*
router.get('/results', function(req, res, next) {
  request('https://idx.mlspin.com/rslts.asp?aid=CN211748&id=59121&min=100000&max=500000&twn=BOST&type=SF&type=CC&type=MF&type=LD&type=CI&type=BU&type=RN&type=MH',
    function(err, resp, html) {
      if (!err){
        const $ = cheerio.load(html);
        console.log(html); 
        res.render('results', { title: 'Results', html:html, results:true });
      }
    });
});






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
