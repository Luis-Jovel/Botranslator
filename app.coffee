yandex_api_key = 'trnsl.1.1.20160825T040759Z.80be8e5e9a32ccb3.13f04204a5fefe27fc5cb69611202fb6b81f6fe0'
# restify = require 'restify'
builder = require 'botbuilder'
yandexApi = require './yandex-api'

#initialize translator from english to spanish by default
translator = new yandexApi yandex_api_key, 'en','es'

# server = restify.createServer()
# server.listen(process.env.port || process.env.PORT || 3978, -> 
# 	console.log '%s listening to %s', server.name, server.url
# );

# Create chat bot

# Production connector
# connector = new builder.ChatConnector(
# 	appId: process.env.MICROSOFT_APP_ID,
# 	appPassword: process.env.MICROSOFT_APP_PASSWORD
# );

# development connector
connector = new builder.ConsoleConnector().listen()

bot = new builder.UniversalBot connector
# server.post '/api/messages', connector.listen()

# Bot dialogs
bot.dialog '/', [
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