request  	= require 'request'
qs 			= require 'qs'

class YandexApi
	constructor: (@api_key, @source_lang, @target_lang) ->
		@base_url = 'https://translate.yandex.net/api/v1.5/tr.json'
	buildUrl: (path, params) ->
		params.key = @api_key
		params.lang = "#{@source_lang}-#{@target_lang}"
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
	translate: (text, callback) ->
		@get(@buildUrl('/translate', {text: text}), (data) ->
			callback(data)
			return
		)
		return
	switch: ->
		new_source_lang = @target_lang
		new_target_lang = @source_lang
		@source_lang = new_source_lang
		@target_lang = new_target_lang
		return	
	
module.exports = YandexApi