(function() {
  var lang;

  lang = {
    intent_change_bot_ui_language: /(language|idioma)/i,
    es: {
      es: "Español",
      en: "Inglés",
      intent_switch_languages: /(inter)?(cambiar|cambi[oa]{1})/i,
      intent_instructions: /(instrucciones|ayuda|manual)/i,
      send_greetings: "¡Hola! mi nombre es BoTranslator, Escribe lo que quieras (LO QUE QUIERAS ;) ;) ) en tus mensajes y trataré de traducirlos (sí, dije \"trataré\").",
      send_instructions: "Actualmente estoy traduciendo de %s a %s, escribe \"cambiar\" o \"intercambiar\" para traducir de %s a %s",
      send_instructions_2: "Si quieres ver las instrucciones en cualquier momento escribe \"instrucciones\" o \"ayuda\"",
      send_instructions_3: "Powered by Yandex.Translate: http://translate.yandex.com",
      send_switch_languages: "Traduciendo de %s a %s",
      send_error: "¡Oops! Lo siento ccurrió un error, no soy perfecto ¿sabes?",
      send_set_bot_ui_language: "¿En cuál idioma quieres que me comunique contigo?",
      send_bot_language_setted: "Me comunicaré contigo en %s, escribe \"idioma\" o \"lenguage\" si deseas cambiarlo",
      send_from_source_to_target_language: "De %s a %s:"
    },
    en: {
      es: "Spanish",
      en: "English",
      intent_switch_languages: /(switch|change|exchange|flip)/i,
      intent_instructions: /(instructions|help|manual)/i,
      send_greetings: "Hi! I'm a Bot Translator, BoTranslator!, Write whatever you want in your messages and I'll try to translate them (yes, I said I'll \"try\").",
      send_instructions: "Currently I'm translating from %s to %s, write \"switch\" or \"change\" to translate from %s to %s",
      send_instructions_2: "You can write \"instructions\" or \"help\" at any time to see the instructions again",
      send_instructions_3: "Powered by Yandex.Translate: http://translate.yandex.com",
      send_switch_languages: "Translating from %s to %s",
      send_error: "¡Oops! An error ocurred, I'm not perfect you know",
      send_set_bot_ui_language: "What language should I use to comunicate with you?",
      send_bot_language_setted: "I will talk to you in %s, write \"language\" or \"idioma\" if you want to change it",
      send_from_source_to_target_language: "From %s to %s:"
    }
  };

  module.exports = lang;

}).call(this);
