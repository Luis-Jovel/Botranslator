(function() {
  var Bot, builder, languages, translator, yandexApi, yandex_api_key;

  yandex_api_key = 'trnsl.1.1.20160825T040759Z.80be8e5e9a32ccb3.13f04204a5fefe27fc5cb69611202fb6b81f6fe0';

  builder = require('botbuilder');

  yandexApi = require('./yandex-api');

  translator = new yandexApi(yandex_api_key);

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
            if (!session.userData.first_message) {
              session.userData.translation_order = {
                source: "en",
                target: "es"
              };
              session.beginDialog('/set-bot-ui-lang');
            } else {
              next();
            }
          };
        })(this), (function(_this) {
          return function(session, args, next) {
            if (!session.userData.first_message) {
              session.userData.first_message = true;
              session.send(_this.lang.send_greetings);
              session.send(_this.lang.send_instructions, _this.lang[translator.source_lang], _this.lang[translator.target_lang], _this.lang[translator.target_lang], _this.lang[translator.source_lang]);
              session.send(_this.lang.send_instructions_2);
              session.send(_this.lang.send_instructions_3);
            }
            session.beginDialog('/intents');
          };
        })(this)
      ]);
      this.bot.dialog('/set-bot-ui-lang', [
        (function(_this) {
          return function(session) {
            var msg;
            session.send("%s\n\n%s", languages.es.send_set_bot_ui_language, languages.en.send_set_bot_ui_language);
            msg = new builder.Message(session).attachments([new builder.HeroCard(session).title("Selecciona una opción / Select an option").buttons([builder.CardAction.imBack(session, "es", languages.es.es), builder.CardAction.imBack(session, "en", languages.en.en)])]);
            builder.Prompts.choice(session, msg, "es|en");
          };
        })(this), (function(_this) {
          return function(session, results) {
            delete _this.intents.handlers["" + _this.lang.intent_switch_languages];
            delete _this.intents.handlers["" + _this.lang.intent_instructions];
            _this.lang = languages[results.response.entity];
            _this.intents.matches(_this.lang.intent_switch_languages, [
              function(session, args, next) {
                var prev_order;
                prev_order = session.userData.translation_order;
                session.userData.translation_order = {
                  source: prev_order.target,
                  target: prev_order.source
                };
                session.send(_this.lang.send_switch_languages, _this.lang[translator.source_lang], _this.lang[translator.target_lang]);
              }
            ]);
            _this.intents.matches(_this.lang.intent_instructions, [
              function(session, args, next) {
                session.send(_this.lang.send_bot_language_setted, _this.lang[results.response.entity]);
                session.send(_this.lang.send_greetings);
                session.send(_this.lang.send_instructions, _this.lang[translator.source_lang], _this.lang[translator.target_lang], _this.lang[translator.target_lang], _this.lang[translator.source_lang]);
                session.send(_this.lang.send_instructions_2);
                session.send(_this.lang.send_instructions_3);
              }
            ]);
            session.send(_this.lang.send_bot_language_setted, _this.lang[results.response.entity]);
            if (!session.userData.first_message) {
              session.endDialog();
            } else {
              session.beginDialog('/intents');
            }
          };
        })(this)
      ]);
      this.bot.dialog('/intents', this.intents);
      this.intents.onDefault([
        (function(_this) {
          return function(session, args, next) {
            var lang;
            lang = _this.lang;
            session.send(_this.lang.send_from_source_to_target_language, _this.lang[translator.source_lang], _this.lang[translator.target_lang]);
            translator.translate(session.message.text, session.userData.translation_order, function(message) {
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
      this.intents.matches(languages.intent_change_bot_ui_language, [
        function(session) {
          session.beginDialog('/set-bot-ui-lang');
        }
      ]);
      this.intents.matches(/\/deleteProfile/, [
        function(session) {
          session.userData = {};
          session.send("userData deleted");
          return session.endDialog();
        }
      ]);
    }

    return Bot;

  })();

  module.exports = Bot;

}).call(this);
