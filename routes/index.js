require('dotenv').config()

const express = require('express');
const router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

const {EMAIL, PASSWORD} = process.env;

console.log('dot env', EMAIL, PASSWORD);



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
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact', result:''});
})

router.get('/search', function(req, res, next) {
  res.render('search-page', { title: 'Search'});
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
        });router.get('/featured', function(req, res, next) {
  res.render('featured', { title: 'Featured'});
})



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

        res.render('results', { title: 'Results', html:$.html(), results:false });
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

        let mainImage = items[0] ? items[0].src : 'crap'
//        let text = $('td.Details').html(); 

        let text = $('td[colspan=2][class=Details][valign=top][width=580]').text().trim()
        //console.log(text)


        $('td, tr, table').each(function() {      // iterate over all elements
          //this.attribs = {};     // remove all attributes
        });
      
      
        $('link[rel=stylesheet]').remove();
        $( "style").empty();
  
      
        let deets = $('td[valign=top][align=left]').html()
        let footage = $($('table[border=0][cellspacing=2][cellpadding=0]')[1]).html()        //footage = $(footage).remove('.Details')

        footage =  `<table>${footage}</table>`
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



// POST route from contact form
router.post('/contact', function (req, res) {
  let mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: EMAIL,
    subject: 'New message',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
        console.log(error)
        res.render('contact', { result: 'There was an error, try again.'});
      
    }
    else {
        res.render('contact', { result: 'Your email was successly sent.'});
      console.log(response) 
    }
  });
});
module.exports = router;
