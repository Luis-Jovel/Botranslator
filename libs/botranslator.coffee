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
		
		# Bot dialogs
		@bot.dialog '/', [
			(session, args, next) =>
				if !session.userData.first_message
					session.beginDialog '/set-bot-ui-lang'
					return
				else
					next()
					return
			(session, args,next) =>
					if !session.userData.first_message
						session.userData.first_message = true
						session.send @lang.send_instructions, @lang[translator.source_lang], @lang[translator.target_lang], @lang[translator.target_lang], @lang[translator.source_lang]
						session.send @lang.send_instructions_2
						session.send @lang.send_instructions_3
					session.beginDialog '/intents'
					return
		]
		@bot.dialog '/set-bot-ui-lang', [
			(session) =>
				session.send "%s\n\n%s", languages.es.send_set_bot_ui_language, languages.en.send_set_bot_ui_language
				#ask user to select language from optio menu
				msg = new builder.Message(session)
					.attachments [
						new builder.HeroCard session
							.title "Selecciona una opción / Select an option"
							.buttons [
								builder.CardAction.imBack session, "es", languages.es.es
								builder.CardAction.imBack session, "en", languages.en.en
							]
					]
				builder.Prompts.choice session, msg, "es|en"
				return
			(session, results) =>
				# Ignore intents from previous selected language, this way we avoid interference 
				# between reserved words from previous and current selected languages
				delete @intents.handlers["#{@lang.intent_switch_languages}"]
				delete @intents.handlers["#{@lang.intent_instructions}"]
				# user's selected language becomes the current langauge
				@lang = languages[results.response.entity]
				# Match intents for selected bot ui language
				@intents.matches @lang.intent_switch_languages, [
					(session, args, next) =>
						translator.switch()
						session.send @lang.send_switch_languages, @lang[translator.source_lang], @lang[translator.target_lang]
						return
				]
				@intents.matches @lang.intent_instructions, [
					(session, args, next) =>
						session.send @lang.send_bot_language_setted, @lang[results.response.entity]
						session.send @lang.send_instructions, @lang[translator.source_lang], @lang[translator.target_lang], @lang[translator.target_lang], @lang[translator.source_lang]
						session.send @lang.send_instructions_2
						session.send @lang.send_instructions_3
						return
				]
				session.send @lang.send_bot_language_setted, @lang[results.response.entity]
				if !session.userData.first_message
					session.endDialog()
				else
					session.beginDialog '/intents'
				return
		]
		@bot.dialog '/intents', @intents

		# Bot intents
		@intents.matches languages.intent_change_bot_ui_language, [
			(session) ->
				session.beginDialog '/set-bot-ui-lang'
				return
		]
		@intents.onDefault [
			(session, args, next) =>
				lang = @lang
				session.send @lang.send_from_source_to_target_language, @lang[translator.source_lang], @lang[translator.target_lang]
				translator.translate session.message.text, (message) ->
						if message.success
							session.send '%s', message.text
							return
						else
							session.send lang.send_error
							return
					return
				return
		]	
module.exports = Bot