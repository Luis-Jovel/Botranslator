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
              next();
            }
          };
        })(this), (function(_this) {
          return function(session, args, next) {
            if (!session.userData.first_message) {
              session.userData.first_message = true;
              session.send('instructions');
            } else {
              next();
            }
          };
        })(this), (function(_this) {
          return function(session, args, next) {
            return session.beginDialog('/intents');
          };
        })(this)
      ]);
      this.bot.dialog('/set-bot-ui-lang', [
        (function(_this) {
          return function(session) {
            builder.Prompts.text(session, languages.es.send_set_bot_ui_language + "\n" + languages.en.send_set_bot_ui_language);
          };
        })(this), (function(_this) {
          return function(session, results) {
            session.userData.bot_ui_language = results.response;
            delete _this.intents.handlers["" + _this.lang.intent_switch_languages];
            delete _this.intents.handlers["" + _this.lang.intent_instructions];
            _this.lang = languages[results.response];
            _this.intents.matches(_this.lang.intent_switch_languages, [
              function(session, args, next) {
                translator["switch"]();
                session.send(_this.lang.send_switch_languages, _this.lang[translator.source_lang], _this.lang[translator.target_lang]);
              }
            ]);
            _this.intents.matches(_this.lang.intent_instructions, [
              function(session, args, next) {
                session.send('instructions');
              }
            ]);
            session.send(_this.lang.send_bot_language_setted, _this.lang[results.response]);
            session.endDialog();
          };
        })(this)
      ]);
      this.bot.dialog('/intents', this.intents);
      this.intents.matches(languages.intent_change_bot_ui_language, [
        function(session) {
          session.beginDialog('/set-bot-ui-lang');
        }
      ]);
      this.intents.onDefault([
        (function(_this) {
          return function(session, args, next) {
            var lang;
            lang = _this.lang;
            translator.translate(session.message.text, function(message) {
              if (message.success) {
                session.send('%s', message.text);
              } else {
                session.send(lang.send_error);
              }
            });
            return;
          };
        })(this)
      ]);
    }

    return Bot;

  })();

  module.exports = Bot;

}).call(this);
