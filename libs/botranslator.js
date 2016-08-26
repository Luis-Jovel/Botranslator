(function() {
  var Bot, builder, translator, yandexApi, yandex_api_key;

  yandex_api_key = 'trnsl.1.1.20160825T040759Z.80be8e5e9a32ccb3.13f04204a5fefe27fc5cb69611202fb6b81f6fe0';

  builder = require('botbuilder');

  yandexApi = require('./yandex-api');

  translator = new yandexApi(yandex_api_key, 'en', 'es');

  Bot = (function() {
    function Bot(connector) {
      this.connector = connector;
      this.bot = new builder.UniversalBot(this.connector);
      this.bot.dialog('/', [
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
    }

    return Bot;

  })();

  module.exports = Bot;

}).call(this);
