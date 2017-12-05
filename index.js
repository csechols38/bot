#!/bin/bash
var bittrex = require('node-bittrex-api');

bittrex.options({
  'apikey' : '5d793bd9d37b4a8888c7bd63091731eb',
  'apisecret' : '74987574fd80444fa4f5315fd25474b7',
});
bittrex.getmarketsummaries( function( data, err ) {
  if (err) {
    return console.error(err);
  }
  for( var i in data.result ) {
    bittrex.getticker( { market : data.result[i].MarketName }, function( ticker ) {
      console.log( ticker );
    });
  }
});