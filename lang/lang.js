(function() {
  var lang;

  lang = {
    intent_change_bot_ui_language: /(language|idioma)/i,
    es: {
      es: "Español",
      en: "Inglés",
      intent_switch_languages: /(inter)?(cambiar|cambi[oa]{1})/i,
      intent_instructions: /(instrucciones|ayuda|manual)/i,
      send_instructions: "Traduciré los mensajes que envíes. Actualmente estoy traduciendo de %s a %s, escribe \"cambiar\" o \"intercambiar\" para traducir de %s a %s",
      send_switch_languages: "Traduciendo de %s a %s",
      send_error: "¡Oops! Lo siento ccurrió un error, no soy perfecto ¿sabes?",
      send_set_bot_ui_language: "¿En cuál idioma quieres que me comunique contigo?",
      send_bot_language_setted: "Me comunicaré contigo en %s, escribe \"idioma\" o \"lenguage\" si deseas cambiarlo"
    },
    en: {
      es: "Spanish",
      en: "English",
      intent_switch_languages: /(switch|change|exchange|flip)/i,
      intent_instructions: /(instructions|help|manual)/i,
      send_instructions: "I'll translate messages you send. Currently I'm translating from %s to %s, write \"switch\" or \"change\" to translate from %s to %s",
      send_switch_languages: "Translating from %s to %s",
      send_error: "¡Oops! An error ocurred, I'm not perfect you know",
      send_set_bot_ui_language: "What language should I use to comunicate with you?",
      send_bot_language_setted: "I will talk to you in %s, write \"language\" or \"idioma\" if you want to change it"
    }
  };

  module.exports = lang;

}).call(this);
