#!/bin/bash

var bittrex = require('node-bittrex-api');
var program = require('commander');
var rates = require("bitcoin-exchange-rates");
var trender = require("trend");
var colors = require("colors");
var currency = 'USD';

/**
 * BittrexAPI class.
 */
var BittrexAPI = function (api) {

  /**
   * Bittrex API.
   */
  this.api = api;

  /**
   * Init method.
   */
  this.init = function () {
    bittrex.options({
      'apikey': '',
      'apisecret': '',
    });
  };

  /**
   * Connect to websocket.
   */
  this.connect = function (callback) {
    this.api.websockets.client(function () {
      console.log('Connected to Bittrex Websocket');
      callback();
    });
  };

  /**
   * Subscribe to more than one market.
   *
   * @param array markets
   */
  this.subscribeToManyMarkets = function (markets, callback) {
    this.api.websockets.subscribe(markets, function (data, client) {
      if (data.M === 'updateExchangeState') {
        callback(data);
      }
    });
  }

  /**
   * Subscribe to single market.
   *
   * @param array market
   */
  this.subscribeToMarket = function (market, callback) {
    this.api.websockets.subscribe([market], function (data) {
      if (data.M === 'updateExchangeState') {
        callback(data);
      }
    });
  }

  /**
   * Subscribe.
   *
   * @param array markets
   */
  this.listen = function (markets, type) {
    this.api.websockets.listen(function (data, client) {
      console.log(data.M);
      if (data.M === type) {
        data.A.forEach(function (data_for) {
          data_for.Deltas.forEach(function (marketsDelta) {
            console.log('Ticker Update for ' + marketsDelta.MarketName, marketsDelta);
          });
        });
      }
    });
  }

  /**
   * Get all markets.
   */
  this.getMarkets = function (callback) {
    var $this = this;
    this.api.getmarkets(function (data, err) {
      if (err) {
        console.log('Error getting markets'.red);
      }
      callback($this._parseResponse(data));
    });
  }

  /**
   * Get market history.
   *
   * @param string market
   */
  this.getMarketHistory = function (market, callback) {
    var $this = this;
    this.api.getmarkethistory({market: market}, function (data, err) {
      if (err) {
        console.log('Error getting market history for %s'.red, market);
      }
      callback($this._parseResponse(data));
    });
  }

  /**
   * Get all market 24 hour summaries.
   *
   * @param string market
   */
  this.getMarketSummaries = function (callback) {
    var $this = this;
    this.api.getmarketsummaries(function (data, err) {
      if (err) {
        console.log('Error getting market summaries'.red);
      }
      callback($this._parseResponse(data));
    });
  }

  /**
   * Get market 24 hour summary.
   *
   * @param string market
   */
  this.getMarketSummary = function (market, callback) {
    var $this = this;
    this.api.getmarketsummary({market: market}, function (data, err) {
      if (err) {
        console.log('Error getting market summary for %s'.red, market);
      }
      callback($this._parseResponse(data));
    });
  }

  /**
   * Get Balance.
   *
   * @param string market
   */
  this.getOrderBook = function (market, depth, callback) {
    var $this = this;
    depth = depth ? depth : 10;
    bittrex.getorderbook(
      {
        market: market,
        depth: depth, type: 'both'
      }, function (data, err) {
        if (err) {
          console.log('Error getting order book for %s'.red, market);
        }
        if (callback) callback($this._parseResponse(data));
      });
  }

  /**
   * Get Balance.
   *
   * @param string market
   */
  this.getBalance = function (market, callback) {
    var $this = this;
    this.api.getbalance({currency: market}, function (data, err) {
      if (err) {
        console.log('Error getting balance for %s'.red, market);
        return null;
      }
      callback($this._parseResponse(data));
    });
  }

  /**
   * Get Balances.
   *
   * @param string callback
   */
  this.getBalances = function (callback) {
    var $this = this;
    this.api.getbalances(function (data, err) {
      if (err) {
        console.log('Error getting balances.'.red);
        return null;
      }
      callback($this._parseResponse(data));
    });
  }

  /**
   * Get ticker.
   *
   * @param string market
   */
  this.getTicker = function (market, callback) {
    var $this = this;
    this.api.getticker({market: market}, function (data, err) {
      if (err) {
        console.log('Error getting ticker for %s'.red, market);
      }
      callback($this._parseResponse(data));
    });
  }

  /**
   * Get Order history.
   *
   * @param string market
   */
  this.getOrderHistory = function (market, callback) {
    var $this = this;
    this.api.getorderhistory({market: market}, function (data, err) {
      if (err) {
        console.log('Error getting order history for %s.', market);
        return null;
      }
      callback($this._parseResponse(data));
    });
  }

  /**
   * Place buy order.
   *
   * @param order
   * @param callback
   *
   * @returns
   */
  this.buyLimit = function (order, callback) {
    var $this = this;
    var response = $this._parseResponse({
      "success": true,
      "message": "",
      "result": {
        "uuid": "614c34e4-8d71-11e3-94b5-425861b86ab6"
      }
    });

    callback(response);

    // this.api.getorderhistory(order, function(data, err) {
    //   if (err) {
    //     return console.error(err);
    //   }
    //   callback($this._parseResponse(data));
    // });
  }

  /**
   * Place sell order.
   *
   * @param order
   * @param callback
   *
   * @returns
   */
  this.sellLimit = function (order, callback) {
    var $this = this;
    var response = $this._parseResponse({
      "success": true,
      "message": "",
      "result": {
        "uuid": "614c34e4-8d71-11e3-94b5-425861b86ab6"
      }
    });

    callback(response);
  }
  /**
   * Parse API response.
   *
   * @param response
   * @returns {Object}
   */
  this._parseResponse = function (response) {
    if (response) {
      if (response.success) {
        return response.result;
      }
    }
  };

  /**
   * init.
   */
  this.init();

}

/**
 * Bot manager class.
 *
 * @type {{}}
 */
var BotManager = {

  startBot: function (bot) {
    this._onStart(bot.name, bot.algorithms, bot.mode);
    bot.start();
  },

  _onStart: function (name, algorithms, mode) {
    console.log('starting "%s"'.green, name);
    console.log('using mode: %s'.blue, mode);
    console.log('algorithms: %s'.blue, algorithms.join(', '));
  },

}


/**
 * Class BittrexBot.
 *
 * @param api
 * @param algorithms
 * @param mode
 */
var BittrexBot = function (api, algorithms, mode, markets) {

  /**
   * Bot name.
   */
  this.name = 'Bittrex Bot';

  /**
   * API
   */
  this.api = api;

  /**
   * Bot mode.
   */
  this.mode = mode;

  /**
   * Markets to use.
   */
  this.markets = markets;

  /**
   * Bot algorythms.
   * Get assigned to each market.
   *
   * @type {Array}
   */
  this.algorithms = algorithms;

  /**
   * Trading markets.
   *
   * @type {Array}
   */
  this.tradingMarkets = [];

  /**
   * List of markets by algorithm.
   *
   * @type {{}}
   */
  this.marketsByAlgorithm = {};

  /**
   * Maximum amount of money allowed for trade purchase.
   *
   * @type {string}
   */
  this.maxBuyAmount = '0.00';

  /**
   *
   * @type {Array}
   */
  this.balances = [];

  /**
   * Start method.
   */
  this.start = function () {
    this.setUp();
  }

  /**
   * Setup method.
   */
  this.setUp = function () {
    var $this = this;
    console.log('waiting for balances to load...'.blue);
    $this.setBalances(function (balances) {
      console.log('balances Loaded'.blue);
      console.log('waiting for market data to load...'.blue);
      $this.loadMarkets(function (markets) {
        if (markets) {
          console.log('market data loaded'.blue);
          var numOfMarkets = markets.length;
          $this.buildMarkets(markets, function (market) {
            numOfMarkets--;
            if (numOfMarkets === 0) {
              console.log('markets built'.blue);
              console.log('bot running...'.green);
              $this.setIntervals();
              setTimeout(function() {
                console.log('loading...');
                console.log('');
              }, 5000);
            }
          });
        }
        else {
          console.log('Market data could not be loaded');
        }
      });
    });
  }

  /**
   * Get markets by algorithm.
   *
   * @param markets
   * @param callback
   *
   * @returns {Object}
   */
  this.buildMarkets = function (markets, callback) {
    var $this = this;
    markets.forEach(function (market) {
      var marketObj = new Market(market.MarketName, $this.api);
      marketObj.setMarketData(market);
      marketObj.init($this.api, true, function () {
        marketObj.setAlgorithms($this.algorithms);
        $this.tradingMarkets.push(marketObj);
        console.log('%s loaded'.blue, marketObj.name);
        callback(marketObj);
      });
    });
  }

  /**
   * Loads markets.
   *
   * @param callback
   */
  this.loadMarkets = function (callback) {
    var desiredMarkets = [];
    var $this = this;
    this.api.getMarkets(function (markets) {
      markets.forEach(function (market) {
        var marketName = market.MarketName;
        if (market.IsActive && $this.markets.indexOf(marketName) > -1) {
          desiredMarkets.push(market);
        }
      });
      callback(desiredMarkets);
    });
  }

  /**
   * Sets balances.
   */
  this.setBalances = function (callabck) {
    var $this = this;
    this.api.getBalances(function (balances) {
      $this.balances = balances;
      if (callabck) callabck($this.balances);
    });
  }

  /**
   * Sets intervals so for bot to continue to run.
   */
  this.setIntervals = function() {
    var $this = this;
    setInterval(function() {
      $this.tradingMarkets.forEach(function(market) {
        market.refresh(function() {
          console.log('');
        });
      });
    }, 1000 * 8);
  }

  /**
   * Sets intervals so for bot to continue to run.
   */
  // this.setIntervals = function () {
  //   var $this = this;
  //
  //   // Refreshes balances.
  //   setInterval(function () {
  //     $this.setBalances();
  //   }, 1000 * 8);
  //
  //   // Refreshes current markets.
  //   setInterval(function () {
  //     $this.tradingMarkets.forEach(function (market) {
  //       market.refresh(function () {
  //         // for (var a in $this.algorithms) {
  //         //   var algo = $this.algorithms[a];
  //         //   algo.analyze(market, function (orders) {
  //         //     console.log(orders);
  //         //   });
  //         // }
  //       });
  //     });
  //   }, 1000 * 5);
  //
  //   // Runs Buy or sell logic.
  //   // setInterval(function () {
  //   //   for (var a in $this.algorithms) {
  //   //     var algo = $this.algorithms[a];
  //   //     algo.analyze($this.tradingMarkets, function (orders) {
  //   //       orders.forEach(function (order) {
  //   //         switch (order.type) {
  //   //           case 'buy':
  //   //             $this.api.buyLimit(order, function (response) {
  //   //               order.setResponse(response);
  //   //               $this.getMarket(order.market, function (market) {
  //   //                 market.orders.push(order);
  //   //
  //   //                 // TOO REMOVE AFTER TESTING
  //   //                 market.setBalance({
  //   //                   "Currency": market.marketCurrency,
  //   //                   "Balance": order.quantity,
  //   //                   "Available": order.quantity,
  //   //                   "Pending": 0.00000000,
  //   //                   "CryptoAddress": "1MacMr6715hjds342dXuLqXcju6fgwHA31",
  //   //                   "Requested": false,
  //   //                   "Uuid": null
  //   //                 });
  //   //
  //   //                 rates.fromBTC(order.rate * order.quantity, currency, function (err, rate) {
  //   //                   if (err) {
  //   //                    //console.error(err);
  //   //                   }
  //   //                   console.log('BUY ************** ***************'.green);
  //   //                   console.log(market.name);
  //   //                   console.log('Transaction Rate: %s', order.rate);
  //   //                   console.log('Transaction Quantity: %s', order.quantity);
  //   //                   console.log('Transaction Amount: $%s', rate);
  //   //                 });
  //   //
  //   //               });
  //   //             });
  //   //             break;
  //   //           case 'sell':
  //   //             $this.api.sellLimit(order, function (response) {
  //   //               order.setResponse(response);
  //   //               $this.getMarket(order.market, function (market) {
  //   //                 market.orders.push(order);
  //   //                 // TODO Remove after testing.
  //   //                 var balance = market.getBalance();
  //   //                 rates.fromBTC(order.rate * balance.Balance, currency, function (err, rate) {
  //   //                   if (err) {
  //   //                     //console.error(err);
  //   //                   }
  //   //                   console.log('SELL ************** ***************'.green);
  //   //                   console.log(market.name);
  //   //                   console.log('Transaction Rate: %s', order.rate);
  //   //                   console.log('Transaction Quantity: %s', order.quantity);
  //   //                   console.log('Transaction Amount: $%s', rate);
  //   //                 });
  //   //                 balance.Balance -= order.quantity;
  //   //
  //   //               });
  //   //             });
  //   //             break;
  //   //         }
  //   //       });
  //   //     });
  //   //   }
  //   // }, 1000 * 5);
  //
  // }

  /**
   * Get all markets.
   *
   * @returns {Array}
   */
  this.getAllMarkets = function () {
    return this.tradingMarkets;
  }

  /**
   * Loads the markets from which we have positions in.
   *
   * @param markets
   * @param balances
   *
   * @todo: marke this an option for command line.
   */
  this.getMarketsFromBalances = function (markets, balances) {
    var $this = this;
    // Set markets  in which you own,
    // that you would not like to trade in.
    var marketsNotWanted = [];
    markets.forEach(function (market) {
      if (market.IsActive) {
        balances.forEach(function (balance) {
          var marketName = market.MarketName;
          if (market.MarketCurrency === balance.Currency && !marketName.includes('USDT')) {
            if (balance.Balance > 0 && marketsNotWanted.indexOf(marketName) < 0) {
              var marketObj = new Market(marketName, $this.api);
              marketObj.setMarketData(market);
              marketObj.setBalance(balance);
              $this.tradingMarkets.push(marketObj);
            }
          }
        });
      }
    });
  }

  /**
   * Get market.
   *
   * @param market
   */
  this.getMarket = function (market, callback) {
    this.tradingMarkets.forEach(function (m) {
      if (m.name === market) {
        callback(m);
      }
    });
  }

}


/**
 * Class DipAndPeakAlgorithm.
 *
 * @constructor
 */
var DipAndPeakAlgorithm = function (market) {

  /**
   *
   * @type {string}
   */
  this.name = 'default';

  /**
   * Current trend.
   *
   * @type {Trend}
   */
  this.trend = null;

  /**
   * Market.
   *
   * @type {Market}
   */
  this.market = market;

  /**
   * Dip amount.
   *
   * @type {number}
   */
  this.dip = 0;

  /**
   * Run amount.
   *
   * @type {number}
   */
  this.run = 0;

  /**
   * Rebound Amount.
   *
   * @type {number}
   */
  this.rebound = 0;

  /**
   * Known high amount.
   *
   * @type {number}
   */
  this.high = 0;

  /**
   * Known low amount.
   *
   * @type {number}
   */
  this.low = 0;

  /**
   * Analyze markets to select an action (buy or sell).
   */
  this.analyze = function (callback) {
    var $this = this;
    this.setTrend();
    var trendType = this.trend.calculateTrend();

    this.getHigh(function(high, highBtc) {
      $this.market.logData();

      switch (trendType) {
        case 'up':
          console.log('current trend: %s'.green, trendType);
          break;
        case 'stalled':
          console.log('current trend: %s'.yellow, trendType);
          break;
        case 'down':
          console.log('current trend: %s'.red, trendType);
          break;
        default:
          console.log('current trend: calculating...'.yellow);
      }

      // Log high.
      console.log('high: $%s (%s)'.green, high, highBtc);

      $this.getLow(function(low, lowBtc) {

        // Log low.
        console.log('low: $%s (%s)'.red, low, lowBtc);

        // Display dip amount.
        $this.getDip(function(dip) {

          // Log dip.
          if (dip > 0) {
            console.log('dip: %s%'.green, dip);
          }
          else {
            console.log('dip: %s%'.red, dip);
          }

          $this.getRebound(function(rebound) {

            // Log rebound amount.
            if (rebound > 0) {
              console.log('rebound: %s%'.green, rebound);
            }
            else {
              console.log('rebound: %s%'.red, rebound);
            }

            $this.getRun(function(run) {
              // Log run amount.
              if (run <= 0) {
                console.log('run: %s%'.red, run);
              }
              else {
                console.log('run: %s%'.green, run);
              }
              callback();
            });
          });
        });
      });
    });
  }

  /**
   * Get the dip amount from last known peak.
   *
   * @param callback
   */
  this.getLow = function(callback) {
    var $this = this;
    this.trend.getLowestDip(function (low, lowBtc) {
      $this.low = lowBtc;
      callback(low, lowBtc);
    });
  }

  /**
   * Get the dip amount from last known peak.
   *
   * @param callback
   */
  this.getHigh = function(callback) {
    var $this = this;
    this.trend.getHighestPeak(function (peak, peakBtc) {
      $this.high = peakBtc;
      callback(peak, peakBtc);
    });
  }

  /**
   * Get the dip amount from last known peak.
   *
   * @param callback
   */
  this.getDip = function(callback) {
    var $this = this;
    this.trend.getHighestPeak(function (peak, peakBtc) {
      var percentChange = $this.trend.calculatePercent($this.trend.getLastPrice(), peakBtc);
      if (percentChange < 0) {
        $this.dip = percentChange * -1;
      }
      else {
        $this.dip = 0;
      }
      callback($this.dip);
    });
  }

  /**
   * Get run.
   *
   * @param callback
   */
  this.getRun = function(callback) {
    var $this = this;
    var percentChangeSinceStart = $this.trend.calculatePercent(
      $this.trend.getLastPrice(),
      $this.trend.startPrice
    );
    $this.run = percentChangeSinceStart > 0 ? percentChangeSinceStart : 0;
    callback($this.run);
  }

  /**
   * Get rebound from last dip.
   *
   * @param callback
   */
  this.getRebound = function(callback) {
    var $this = this;
    this.trend.getLowestDip(function (dip, dipBtc) {
      var change = $this.trend.calculatePercent($this.trend.getLastPrice(), dipBtc);
      $this.rebound = change > 0 ? change : 0;
      callback($this.rebound);
    });
  }

  /**
   * Set trend
   */
  this.setTrend = function () {
    var trend = this.getTrend();
    var lastPrice = this.market.ticker.Last;
    if (!trend) {
      this.trend = new Trend(lastPrice);
    }
    else if (trend.getLastPrice() !== lastPrice){
      this.trend.setLastPrice(lastPrice);
    }
    return this.trend;
  }

  /**
   * Get trend.
   *
   * @returns {Trend}
   */
  this.getTrend = function () {
    return this.trend;
  }

}

/**
 * Class Trend.
 *
 * @constructor
 */
var Trend = function (lastPrice) {
  this.time = Math.round((new Date()).getTime() / 1000);
  this.prices = [];
  this.prices.push(lastPrice);
  this.trend = null;
  this.startPrice = lastPrice;

  /**
   * Get last price.
   *
   * @param price
   */
  this.setLastPrice = function (price) {
    this.prices.push(price);
  }

  /**
   * Set last price.
   *
   * @param price
   */
  this.getLastPrice = function () {
    var last = this.prices.slice(-1);
    if (last.length) {
      return last[0];
    }
  }

  /**
   * Get time.
   */
  this.getTime = function () {
    return Math.round((new Date()).getTime() / 1000);
  }

  // this.isWaitingForDip = function() {
  //   var price = this.getLastPrice();
  //   var diff = (price - this.lastPrice);
  //   diff = diff / this.lastPrice * 100;
  //   console.log('Change: %s%'.red, Math.round(diff));
  // }

  this.getStartOfDip = function(callback) {

  }

  this.getHighestPeak = function(callback) {
    var highestPrice = Math.max.apply(null, this.prices);
    this.convertRates(highestPrice, function(rate) {
      callback(rate, highestPrice);
    });
  }

  this.getLowestDip = function(callback) {
    var lowestPrice = Math.min.apply(null, this.prices);
    this.convertRates(lowestPrice, function(rate) {
      callback(rate, lowestPrice);
    });
  }

  this.calculatePercent = function(newAmt, oldAmt) {
    var diff = (newAmt - oldAmt);
    return diff / oldAmt * 100;
  }

  /**
   * Calculate the trend.
   *
   * @returns {string}
   */
  this.calculateTrend = function () {
    var trend;
    var lastPrice;
    var dips = 0;
    var gains = 0;
    var stalls = 0;
   this.prices.forEach(function (price){
     if (lastPrice !== undefined) {
       if (price > lastPrice) {
         gains++;
       }
       else if (lastPrice === price) {
         stalls++;
       }
       else {
         dips++;
       }
     }
     lastPrice = price;
   });

   // TODO: Use dip as percentage. track dip and then track gains to find dip and peak.

    var winner = Math.max(dips, gains, stalls);

    // console.log(winner);
    // console.log(dips);
    // console.log(stalls);
    // console.log(gains);

    if (dips === winner) {
      trend = 'down';
    }
    else if (gains === winner) {
      trend = 'up';
    }
    else if(stalls === winner) {
      trend = 'stalled';
    }

    this.trend = trend;
    return trend;
  }

  /**
   * Convert coin to USD.
   *
   * @param amount
   * @param callback
   */
  this.convertRates = function (amount, callback) {
    var currency = 'USD';
    rates.fromBTC(amount, currency, function (err, rate) {
      if (err) {
        //console.error(err);
      }
      callback(rate);
    });
  }

}


/**
 * Class Market.
 *
 * @param name
 * @constructor
 */
var Market = function (name) {

  this.name = name;
  this.api = null;
  this.summary = null;
  this.history = null;
  this.orderBook = null;
  this.statistics = {};
  this.balance = null;
  this.ticker = null;
  this.orderHistory = null;
  this.BaseCurrency = null;
  this.marketCurrency = null;
  this.trend = null;
  this.orders = [];
  this.algorithms = [];

  /**
   * Sets market data.
   *
   * @param marketData
   */
  this.setMarketData = function (marketData) {
    this.BaseCurrency = marketData.BaseCurrency;
    this.marketCurrency = marketData.MarketCurrency;
  }

  /**
   * Init method.
   *
   * @param api
   * @param force
   * @param callback
   */
  this.init = function (api, force, callback) {
    this.api = api;
    var $this = this;
    this.getSummary(function () {
      $this.getHistory(function () {
        $this.getOrderBook(function () {
          $this.getBalance(function () {
            $this.getTicker(function () {
              $this.getOrderHistory(function () {
                $this.analyze(function () {
                  callback();
                });
              }, force);
            }, force);
          }, force);
        }, force)
      }, force);
    }, force);
  }

  /**
   * Refresh method.
   *
   * @param callback
   */
  this.refresh = function (callback) {
    var $this = this;
    this.init(this.api, true, function() {
      $this.updateAlgorithms(function() {
        callback();
      });
    });
  }

  /**
   * Analyze market.
   */
  this.analyze = function (callback) {
    this.generateStatistics(function () {
      callback();
    });
  }

  /**
   * OUtputs data to console.
   */
  this.logData = function () {
    console.log(this.name.blue);
    if (this.statistics.priceChangeToday < 0) {
      console.log(this.statistics.priceChange);
      console.log('current price: $%s (%s)'.red, this.statistics.priceUsd, this.statistics.priceBtc);
      console.log('change today: %s%'.red, Match.round(this.statistics.priceChangeToday));
    }
    else {
      console.log('current price: $%s (%s)'.green, this.statistics.priceUsd, this.statistics.priceBtc);
      console.log('change today: %s%'.green, Math.round(this.statistics.priceChangeToday));
    }

    var balance = this.balance > 0 ? this.balance.Balance : 0;
    console.log('balance: %s'.green, balance);
    // TODO: fix balance.

    console.log('24 hour high: $%s (%s)'.green, this.statistics.highUsd, this.statistics.highBtc);
    console.log('24 hour low: $%s (%s)'.yellow, this.statistics.lowUsd, this.statistics.lowBtc);
    console.log('volume: %s'.green, this.summary.Volume);
  }

  /**
   * Set statistics.
   */
  this.generateStatistics = function (callback) {
    var $this = this;
    var lastTradeAmount = this.ticker.Last;
    if (this.statistics.baseLastTradeAmount === undefined) {
      this.statistics.baseLastTradeAmount = lastTradeAmount;
    }
    var lastVolumeAmount = this.summary.Volume;
    if (this.statistics.baseVolumeAmount === undefined) {
      this.statistics.baseVolumeAmount = lastVolumeAmount;
    }

    this.statistics.lastVolume = lastVolumeAmount;
    var volumeDiff = (lastVolumeAmount - this.statistics.baseVolumeAmount);
    this.statistics.volumeChange = volumeDiff / this.statistics.baseVolumeAmount * 100;

    this.statistics.lastTradeAmount = lastTradeAmount;
    var priceDiff = (lastTradeAmount - this.statistics.baseLastTradeAmount);
    this.statistics.priceChange = priceDiff / this.statistics.baseLastTradeAmount * 100;

    this.convertRates(lastTradeAmount, function (rate) {
      $this.statistics.priceUsd = rate;
    });

    var priceChangeToday = lastTradeAmount - this.summary.Low;
    this.statistics.priceChangeToday = priceChangeToday / this.summary.Low * 100;

    this.statistics.lowBtc = this.summary.Low;
    this.convertRates(this.summary.Low, function (rate) {
      $this.statistics.lowUsd = rate;
    });
    this.statistics.highBtc = this.summary.High;
    this.convertRates(this.summary.High, function (rate) {
      $this.statistics.highUsd = rate;
    });

    this.statistics.openBuyOrders = this.summary.OpenBuyOrders;
    this.statistics.openSellOrers = this.summary.OpenSellOrders;

    this.statistics.priceBtc = lastTradeAmount;

    // Set a timeout before callback is called.
    // This allows enough time for the rates to convert.
    setTimeout(function () {
      callback()
    }, 1000);
  }

  /**
   *
   * @param callback
   * @param force
   */
  this.getHistory = function (callback, force) {
    var $this = this;
    if (!this.history || force) {
      this.api.getMarketHistory(this.name, function (history) {
        $this.setHistory(history);
        if (callback) callback(callback);
      });
    }
    else if (callback) {
      callback(this.history);
    }
  };

  this.setHistory = function (history) {
    this.history = history;
  };

  this.getSummary = function (callback, force) {
    var $this = this;
    if (!this.summary || force) {
      this.api.getMarketSummary(this.name, function (summary) {
        if (summary) {
          $this.setSummary(summary[0]);
          if (callback) callback(summary[0]);
        }
        else if (callback) {
          callback(null);
        }
      });
    }
    else if (callback) {
      callback(this.summary);
    }
  };

  this.setSummary = function (summary) {
    this.summary = summary;
  };

  this.getOrderBook = function (callback, force) {
    var $this = this;
    if (!this.orderBook || force) {
      this.api.getOrderBook(this.name, 10, function (orderBook) {
        $this.setOrderBook(orderBook);
        if (callback) callback(orderBook);
      });
    }
    else if (callback) {
      callback(this.orderBook);
    }
  };

  this.setOrderBook = function (orderBook) {
    this.orderBook = orderBook;
  };

  this.getBalance = function (callback, force) {
    var $this = this;
    // if (this.balance === null || force) {
    if (this.balance === null) {
      this.api.getBalance(this.marketCurrency, function (balance) {
        if (balance) {
          $this.setBalance(balance);
        }
        if (callback) callback(balance);

      });
    }
    else if (callback) {
      callback(this.balance);
    }
    return this.balance;
  };

  this.setBalance = function (balance) {
    this.balance = balance;
  }

  this.getTicker = function (callback, force) {
    var $this = this;
    if (!this.ticker || force) {
      this.api.getTicker(this.name, function (ticker) {
        $this.setTicker(ticker);
        if (callback) callback(ticker);
      });
    }
    else if (callback) {
      callback(this.ticker);
    }
  };

  this.setTicker = function (ticker) {
    this.ticker = ticker;
  }

  this.getOrderHistory = function (callback, force) {
    var $this = this;
    if (!this.orderHistory || force) {
      this.api.getOrderHistory(this.name, function (orderHistory) {
        if (orderHistory) {
          $this.setOrderHistory(orderHistory);
        }
        if (callback) callback(orderHistory);
      });
    }
    else if (callback) {
      callback(this.orderHistory);
    }
  };

  this.setOrderHistory = function (orderHistory) {
    this.orderHistory = orderHistory;
  }

  /**
   * Convert coin to USD.
   *
   * @param amount
   * @param callback
   */
  this.convertRates = function (amount, callback) {
    var currency = 'USD';
    rates.fromBTC(amount, currency, function (err, rate) {
      if (err) {
        //console.error(err);
      }
      callback(rate);
    });
  }

  /**
   * Set algorithms.
   *
   * @param algorithms
   */
  this.setAlgorithms = function (algorithms) {
    var $this = this;
    algorithms.forEach(function (algorithm) {
      algorithm = new constructors[algorithm]($this);
      $this.algorithms.push(algorithm);
    });
  }

  /**
   * Update algorithms.
   */
  this.updateAlgorithms = function (callback) {
    this.getAlgorithms().forEach(function (algorithm) {
      algorithm.analyze(function() {
        callback();
      });
    });
  }

  /**
   * Get algorithms.
   *
   * @returns {Array}
   */
  this.getAlgorithms = function () {
    return this.algorithms;
  }

}

/**
 * Class Order.
 *
 * @param market
 * @param quantity
 * @param rate
 * @constructor
 */
var Order = function (type, market, quantity, rate) {
  this.type = type;
  this.market = market;
  this.quantity = quantity;
  this.rate = rate;
  this.uuid = null;
  this.response = null;

  /**
   *
   * @param response
   */
  this.setResponse = function (response) {
    this.response = response;
    if (response.uuid) {
      this.setUuid(response.uuid);
    }
  }

  /**
   *
   * @param response
   */
  this.setUuid = function (uuid) {
    this.uuid = uuid;
  }

  /**
   * Get current date time.
   *
   * @returns {string}
   */
  this.getCurrentDate = function () {
    var currentdate = new Date();
    var date = currentdate.getDate() + "/"
      + (currentdate.getMonth() + 1) + "/"
      + currentdate.getFullYear() + " @ "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();
    return date;
  }

  this.time = this.getCurrentDate();

}

/**
 * Class dictionary.
 *
 * @type {{Class1: *, Class2: *}}
 */
var constructors = {
  DipAndPeakAlgorithm: DipAndPeakAlgorithm,
};


/**
 * Command line program logic.
 */
program
  .version('0.0.1')
  .command('start [mode]')
  .description('Start a trading bot.')
  .option('-m, --markets <markets>', "The markets to use.")
  .action(function (mode, options) {
    if (options.markets !== undefined) {
      var markets = options.markets.split(" ");
      mode = mode || 'default';
      var bot = new BittrexBot(new BittrexAPI(bittrex), ['DipAndPeakAlgorithm'], mode, markets);
      BotManager.startBot(bot);
    }
    else {
      console.log('No markets set. Set markets using the "-m" command.');
    }
  }).on('--help', function () {
  console.log('When using default mode you must specify which markets to use.');
});

program.parse(process.argv);