(function() {
  var Bot, builder, languages, translator, yandexApi, yandex_api_key;

  yandex_api_key = 'trnsl.1.1.20160825T040759Z.80be8e5e9a32ccb3.13f04204a5fefe27fc5cb69611202fb6b81f6fe0';

  builder = require('botbuilder');

  yandexApi = require('./yandex-api');

  translator = new yandexApi(yandex_api_key, 'en', 'es');

  languages = new require('../lang/lang');

  Bot = (function() {
    function Bot(connector) {
      this.connector = connector;
      this.lang = languages.es;
      this.bot = new builder.UniversalBot(this.connector);
      this.intents = new builder.IntentDialog();
      this.bot.dialog('/', [
        (function(_this) {
          return function(session, args, next) {
            if (!session.userData.bot_ui_language) {
              session.beginDialog('/set-bot-ui-lang');
            } else {
              session.send('todo bien');
            }
          };
        })(this)
      ]);
      this.intents.matches(this.lang.intent_switch_languages, [
        (function(_this) {
          return function(session, args, next) {
            translator["switch"]();
            session.send(_this.lang.send_switch_languages, _this.lang[translator.source_lang], _this.lang[translator.target_lang]);
          };
        })(this)
      ]);
      this.intents.onDefault([
        (function(_this) {
          return function(session, args, next) {
            translator.translate(session.message.text, function(message) {
              if (message.success) {
                session.send('%s', message.text);
              } else {
                session.send(this.lang.send_error);
              }
            });
            return;
          };
        })(this)
      ]);
      this.bot.dialog('/set-bot-ui-lang', [
        function(session) {
          builder.Prompts.text(session, 'idioma?');
        }, function(session, results) {
          session.userData.bot_ui_language = results.response;
          session.endDialog();
        }
      ]);
    }

    return Bot;

  })();

  module.exports = Bot;

}).call(this);
