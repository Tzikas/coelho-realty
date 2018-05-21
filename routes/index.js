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

        let items = []
        let imageHTML = '' 
    
        $('.divThumb img').attr('src', function(i, currentValue){
          //currentValue = currentValue.replace('w=96&h=75','w=964&h=1024')        
         
          if(!currentValue.includes('null')){
           
           let url = currentValue; 
            url = RemoveParameterFromUrl(url, 'w');
            url = RemoveParameterFromUrl(url, 'h');

            //let item = 'https://idx.mlspin.com/' + currentValue;
            let item = 'https://idx.mlspin.com' + url //+ '&w=946&h=1024';


            items.push({
              src: item,
              w: 964,
              h: 1024
            })
              imageHTML += `<img src=${item}/>`
              return null;
              //return item
          }
          //
        });

        let mainImage = items ? items[0].src : 'crap'
//        let text = $('td.Details').html(); 

        let text = $('td[colspan=2][class=Details][valign=top][width=580]').text().trim()
        console.log(text)


        $('td, tr, table').each(function() {      // iterate over all elements
          //this.attribs = {};     // remove all attributes
        });
      
      
        $('link[rel=stylesheet]').remove();
        $( "style").empty();
  
      
        let deets = $('td[valign=top][align=left]').html()
        let footage = $($('table[border=0][cellspacing=2][cellpadding=0]')[1]).parent().html()


        //console.log('footage')
        //console.log(footage)

  // $(text).html(function (i, html) {
   // return '<b>' + html.trim().replace(/(\s+)/g, '</b>$1<b>') + '</b>'
//})

    
        //console.log(html); 
        res.render('details', { title: 'Details', html:$.html(), deets:deets, text:text, mainImage: mainImage, items:items, footage:footage, results:false, imageHTML:imageHTML });
      }
    });
    

})


function RemoveParameterFromUrl(url, parameter) {
  return url
    .replace(new RegExp('[?&]' + parameter + '=[^&#]*(#.*)?$'), '$1')
    .replace(new RegExp('([?&])' + parameter + '=[^&]*&'), '$1');
}
module.exports = router;
