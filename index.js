var todoList = require('./todoList.js');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cheerio = require('cheerio');
var template = require('consolidate').handlebars;

var app = express();
app.engine('hbs', template);

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use( bodyParser.urlencoded() );
app.use( bodyParser.json() );
 
app.get('/', function (req, res) {
	todoList.list(function(err, rows) {
      if (err)
        throw err;
      res.render('form', {news: rows});
    });
});

app.post('/', function (req, res) {
	  if (req.body.site == 'newsMailRu') 
    {
      request('https://news.mail.ru/' + req.body.category, 
            function (error, response, html) {
            if (error)
                throw error;
            
            if ( response.statusCode !== 200 )
              return console.log('incorrect statusCode: ', response.statusCode);

            var $ = cheerio.load(html);

            $('.paging__content span.newsitem__text').each(function(ind,elem) { 
               todoList.add($(elem).text().trim());
               todoList.list(function(err, rows) {
                if (err)
                  throw err;
                res.render('form', {news: rows});
              });
            });
        });
    }

    if (req.body.site == 'newsRu') 
    { 
       if (req.body.category == 'economics') {
        req.body.category = 'finance';
       }

      if (req.body.category == 'society') {
        req.body.category = 'cinema';
      }

       request('http://www.newsru.com/' + req.body.category, 
            function (error, response, html) {
            if (error)
              throw error;
            if ( response.statusCode !== 200 )
                return console.log('incorrect statusCode: ', response.statusCode);
       
            var $ = cheerio.load(html);

            $('.body-page-center-column .index-news-content').each(function(ind,elem) { 
              todoList.add($(elem).text().trim());
              todoList.list(function(err, rows) {
                if (err)
                  throw err;
                res.render('form', {news: rows});
              });
          });
      });
  };

  if (req.body.text) {
    todoList.add(req.body.text);
    todoList.list(function(err, rows) {
      if (err)
        throw err;
      res.render('form', {news: rows});
    });
  };

  if (req.body.deleteBtn) {
    todoList.delete(req.body.id);
    todoList.list(function(err, rows) {
      if (err)
        throw err;
      res.render('form', {news: rows});
    });
  };

  if (req.body.newText) {
    todoList.change(req.body.id, req.body.newText);
    todoList.list(function(err, rows) {
      if (err)
        throw err;
      res.render('form', {news: rows});
    });
  };

  if (req.body.done) {
    todoList.complete(req.body.id);
    todoList.list(function(err, rows) {
      if (err)
        throw err;
      res.render('form', {news: rows});
    });
  };
});

app.listen(8000, function () {
  console.log('Server was running on: ', 8000);
});
