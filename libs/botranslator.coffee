yandex_api_key = 'trnsl.1.1.20160825T040759Z.80be8e5e9a32ccb3.13f04204a5fefe27fc5cb69611202fb6b81f6fe0'
builder = require 'botbuilder'
yandexApi = require './yandex-api'

#initialize translator from english to spanish by default
translator = new yandexApi yandex_api_key, 'en','es'

class Bot
	constructor: (@connector) ->
		@bot = new builder.UniversalBot @connector
	
		# Bot dialogs
		@bot.dialog '/', [
			(session, args, next) ->
				translator.translate session.message.text, (message) ->
						if message.success
							session.send '%s', message.text
							return
						else
							# handel error
							return
					return
				return
		]
module.exports = Bot