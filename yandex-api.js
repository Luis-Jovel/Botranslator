(function() {
  var YandexApi, qs, request;

  request = require('request');

  qs = require('qs');

  YandexApi = (function() {
    function YandexApi(api_key, source_lang, target_lang) {
      this.api_key = api_key;
      this.source_lang = source_lang;
      this.target_lang = target_lang;
      this.base_url = 'https://translate.yandex.net/api/v1.5/tr.json';
    }

    YandexApi.prototype.buildUrl = function(path, params) {
      params.key = this.api_key;
      params.lang = this.source_lang + "-" + this.target_lang;
      params.options = 1;
      return "" + this.base_url + path + "?" + (qs.stringify(params));
    };

    YandexApi.prototype.get = function(url, callback) {
      request.get(url, function(err, res, body) {
        var data;
        if (err || res.statusCode !== 200) {
          data.success = false;
          data.err = err;
        } else {
          data = JSON.parse(body);
          data.success = true;
        }
        callback(data);
      });
    };

    YandexApi.prototype.translate = function(text, callback) {
      this.get(this.buildUrl('/translate', {
        text: text
      }), function(data) {
        callback(data);
      });
    };

    YandexApi.prototype["switch"] = function() {
      var new_source_lang, new_target_lang;
      new_source_lang = this.target_lang;
      new_target_lang = this.source_lang;
      this.source_lang = new_source_lang;
      this.target_lang = new_target_lang;
    };

    return YandexApi;

  })();

  module.exports = YandexApi;

}).call(this);
