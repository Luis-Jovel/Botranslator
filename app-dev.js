(function() {
  var Botranslator, bot, builder, connector;

  Botranslator = require('./libs/botranslator');

  builder = require('botbuilder');

  connector = new builder.ConsoleConnector().listen();

  bot = new Botranslator(connector);

}).call(this);
