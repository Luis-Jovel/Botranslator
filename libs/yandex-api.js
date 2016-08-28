(function() {
  var YandexApi, qs, request;

  request = require('request');

  qs = require('qs');

  YandexApi = (function() {
    function YandexApi(api_key) {
      this.api_key = api_key;
      this.base_url = 'https://translate.yandex.net/api/v1.5/tr.json';
    }

    YandexApi.prototype.buildUrl = function(path, params, languages) {
      params.key = this.api_key;
      params.lang = languages.source + "-" + languages.target;
      params.options = 1;
      return "" + this.base_url + path + "?" + (qs.stringify(params));
    };

    YandexApi.prototype.get = function(url, callback) {
      request.get(url, function(err, res, body) {
        var data;
        data = {};
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

    YandexApi.prototype.translate = function(text, languages, callback) {
      this.get(this.buildUrl('/translate', {
        text: text
      }, languages), function(data) {
        callback(data);
      });
    };

    return YandexApi;

  })();

  module.exports = YandexApi;

}).call(this);
