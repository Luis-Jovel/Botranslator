(function() {
  var lang;

  lang = {
    es: {
      es: "Español",
      en: "Inglés",
      intent_switch_languages: /(inter)?(cambiar|cambi[oa]{1})/i,
      send_switch_languages: "Traduciendo de %s a %s",
      send_error: "¡Oops! Lo siento ccurrió un error, no soy perfecto ¿sabes?",
      send_set_bot_ui_language: "¿En cuál idioma quieres que me comunique contigo?"
    },
    en: {
      es: "Spanish",
      en: "English",
      intent_switch_languages: /switch|change|exchange|flip/i,
      send_switch_languages: "Translating from %s to %s",
      send_error: "¡Oops! An error ocurred, I'm not perfect you know",
      send_set_bot_ui_language: "What language should I use to comunicate with you?"
    }
  };

  module.exports = lang;

}).call(this);
