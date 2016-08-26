yandex_api_key = 'trnsl.1.1.20160825T040759Z.80be8e5e9a32ccb3.13f04204a5fefe27fc5cb69611202fb6b81f6fe0'
builder = require 'botbuilder'
yandexApi = require './yandex-api'

#initialize translator from english to spanish by default
translator = new yandexApi yandex_api_key, 'en','es'

languages = new require '../lang/lang'
class Bot
	constructor: (@connector) ->
		@lang = languages.es
		@bot = new builder.UniversalBot @connector
		@intents = new builder.IntentDialog()
		@bot.dialog '/', [
			(session, args, next) =>
				if !session.userData.bot_ui_language
					session.beginDialog('/set-bot-ui-lang');
					return
				else
					session.send 'todo bien'
					# next()		
					return
			# @intents
		]

		# Bot intents
		@intents.matches @lang.intent_switch_languages, [
			(session, args, next) =>
				translator.switch()
				session.send @lang.send_switch_languages, @lang[translator.source_lang], @lang[translator.target_lang]
				return
		]
		@intents.onDefault [
			(session, args, next) =>
				translator.translate session.message.text, (message) ->
						if message.success
							session.send '%s', message.text
							return
						else
							session.send @lang.send_error
							return
					return
				return
		]
		# Bot dialogs
		@bot.dialog '/set-bot-ui-lang', [
			(session) ->
				builder.Prompts.text session, 'idioma?'
				return
			(session, results) ->
				session.userData.bot_ui_language = results.response
				session.endDialog()
				return
		]
module.exports = Bot