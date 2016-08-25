(function() {
  var bot, builder, connector, translator, yandexApi, yandex_api_key;

  yandex_api_key = 'trnsl.1.1.20160825T040759Z.80be8e5e9a32ccb3.13f04204a5fefe27fc5cb69611202fb6b81f6fe0';

  builder = require('botbuilder');

  yandexApi = require('./yandex-api');

  translator = new yandexApi(yandex_api_key, 'en', 'es');

  connector = new builder.ConsoleConnector().listen();

  bot = new builder.UniversalBot(connector);

  bot.dialog('/', [
    function(session, args, next) {
      translator.translate(session.message.text, function(message) {
        if (message.success) {
          session.send('%s', message.text);
        } else {

        }
      });
      return;
    }
  ]);

}).call(this);
