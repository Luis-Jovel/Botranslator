request  	= require 'request'
qs 			= require 'qs'

class YandexApi
	constructor: (@api_key) ->
		@base_url = 'https://translate.yandex.net/api/v1.5/tr.json'
	buildUrl: (path, params, languages) ->
		params.key = @api_key
		params.lang = "#{languages.source}-#{languages.target}"
		params.options = 1
		return "#{@base_url}#{path}?#{qs.stringify(params)}"
	get: (url, callback) ->
		request.get url, (err, res, body) ->
			data = {}
			if err || res.statusCode isnt 200
				data.success = false
				data.err = err
			else
				data = JSON.parse(body)
				data.success = true
			callback(data)
			return
		return
	translate: (text, languages, callback) ->
		@get(@buildUrl('/translate', {text: text}, languages), (data) ->
			callback(data)
			return
		)
		return	
module.exports = YandexApi