#!/usr/bin/env node
var request = require('request');
var cheerio = require('cheerio');
var argv = require('yargs').argv;
var iconv = require('iconv-lite');
var colors = require('colors');

var options = {
	url: 'http://www.bjsubway.com/e/action/ListInfo/?classid=39',
	encoding: null,
	headers: {  
	  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
	}
};

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
  	var line = argv.line;
  	var direction = argv.direction;
  	var station = argv.station;
  	var isFirst;

  	var html = iconv.decode(body, 'gb2312');
    var $ = cheerio.load(html, {decodeEntities: false});
    //console.log($('table.one').html());
    if($('table.' + line).find('thead tr').eq(1).find('td').eq(1).text().indexOf(direction) != -1) {
    	isFirst = true;
    } else {
    	isFirst = false;
    }

	$('table.' + line).find('tbody tr').each(function(i, dom) {
		if($(this).find('th').text().replace(/^\s+/, '').replace(/\s+$/, '') == station) {
			if(isFirst) {
				console.log('首车时间'.red, $(this).find('td').eq(0).text().replace(/^\s+/, '').replace(/\s+$/, '').red);
				console.log('末车时间'.red, $(this).find('td').eq(1).text().replace(/^\s+/, '').replace(/\s+$/, '').red);
			} else {
				console.log('首车时间'.red, $(this).find('td').eq(2).text().replace(/^\s+/, '').replace(/\s+$/, '').red);
				console.log('末车时间'.red, $(this).find('td').eq(3).text().replace(/^\s+/, '').replace(/\s+$/, '').red);
			}
		}
	});
  }
})