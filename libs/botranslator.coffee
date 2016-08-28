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
					session.beginDialog '/intents'
					return
		]
		@bot.dialog '/set-bot-ui-lang', [
			(session) =>
				# builder.Prompts.text session, "#{languages.es.send_set_bot_ui_language}\n#{languages.en.send_set_bot_ui_language}"
				# session.send "%s.\n\n%s", languages.es.send_set_bot_ui_language, languages.en.send_set_bot_ui_language
				#ask user to select language from optio menu
				msg = new builder.Message(session)
					.attachments [
						new builder.HeroCard session
							.title "¡Bienvenido! / Welcome!"
							.subtitle "#{languages.es.send_set_bot_ui_language}\n\n#{languages.en.send_set_bot_ui_language}"
							.buttons [
								builder.CardAction.imBack session, "es", languages.es.es
								builder.CardAction.imBack session, "en", languages.en.en
							]
					]
				builder.Prompts.choice session, msg, "es|en"
				return
			(session, results) =>
				# Ignore intents from previous selected language
				console.log "before deleting intents: #{@lang}"
				if @lang?
					delete @intents.handlers["#{@lang.intent_switch_languages}"]
					delete @intents.handlers["#{@lang.intent_instructions}"]
				@lang = languages[results.response]
				console.log "after deleting intents and changing lang: #{@lang}"
				# Match intents for selected bot ui language
				@intents.matches @lang.intent_switch_languages, [
					(session, args, next) =>
						translator.switch()
						session.send @lang.send_switch_languages, @lang[translator.source_lang], @lang[translator.target_lang]
						return
				]
				@intents.matches @lang.intent_instructions, [
					(session, args, next) =>
						session.send @lang.send_instructions, @lang[translator.source_lang], @lang[translator.target_lang], @lang[translator.target_lang], @lang[translator.source_lang]
						return
				]
				session.endDialog @lang.send_bot_language_setted, @lang[results.response]
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