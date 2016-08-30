yandex_api_key = 'trnsl.1.1.20160825T040759Z.80be8e5e9a32ccb3.13f04204a5fefe27fc5cb69611202fb6b81f6fe0'
builder = require 'botbuilder'
yandexApi = require './yandex-api'

#initialize translator
translator = new yandexApi yandex_api_key

languages = new require '../lang/lang'
class Bot
	constructor: (@connector) ->
		@bot = new builder.UniversalBot @connector
		@intents = new builder.IntentDialog()
		
		# Bot dialogs
		@bot.dialog '/', [
			(session, args, next) =>
				if !session.userData.first_message
					# set bot ui language to spanish by default
					session.userData.bot_ui_lang = "es"
					# initialize translation from english to spanish by default
					session.userData.translation_order =
						source: "en"
						target: "es"
					session.beginDialog '/set-bot-ui-lang'
					return
				else
					next()
					return
			(session, args,next) =>
					if !session.userData.first_message
						session.userData.first_message = true
						session.send languages[session.userData.bot_ui_lang].send_greetings
						session.send languages[session.userData.bot_ui_lang].send_instructions, languages[session.userData.bot_ui_lang][session.userData.translation_order.source], languages[session.userData.bot_ui_lang][session.userData.translation_order.target], languages[session.userData.bot_ui_lang][session.userData.translation_order.target], languages[session.userData.bot_ui_lang][session.userData.translation_order.source]
						session.send languages[session.userData.bot_ui_lang].send_instructions_2
						session.send languages[session.userData.bot_ui_lang].send_instructions_3
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
				delete @intents.handlers["#{languages[session.userData.bot_ui_lang].intent_switch_languages}"]
				delete @intents.handlers["#{languages[session.userData.bot_ui_lang].intent_instructions}"]
				# user's selected language becomes the current langauge
				session.userData.bot_ui_lang = results.response.entity
				# Match intents for selected bot ui language
				@intents.matches languages[session.userData.bot_ui_lang].intent_switch_languages, [
					(session, args, next) =>
						# intent for changing the order of the translation
						prev_order = session.userData.translation_order
						session.userData.translation_order =
							source: prev_order.target
							target: prev_order.source
						session.send languages[session.userData.bot_ui_lang].send_switch_languages, languages[session.userData.bot_ui_lang][session.userData.translation_order.source], languages[session.userData.bot_ui_lang][session.userData.translation_order.target]
						return
				]
				@intents.matches languages[session.userData.bot_ui_lang].intent_instructions, [
					(session, args, next) =>
						# intent for showing instructions
						session.send languages[session.userData.bot_ui_lang].send_bot_language_setted, languages[session.userData.bot_ui_lang][results.response.entity]
						session.send languages[session.userData.bot_ui_lang].send_greetings
						session.send languages[session.userData.bot_ui_lang].send_instructions, languages[session.userData.bot_ui_lang][session.userData.translation_order.source], languages[session.userData.bot_ui_lang][session.userData.translation_order.target], languages[session.userData.bot_ui_lang][session.userData.translation_order.target], languages[session.userData.bot_ui_lang][session.userData.translation_order.source]
						session.send languages[session.userData.bot_ui_lang].send_instructions_2
						session.send languages[session.userData.bot_ui_lang].send_instructions_3
						return
				]
				session.send languages[session.userData.bot_ui_lang].send_bot_language_setted, languages[session.userData.bot_ui_lang][results.response.entity]
				if !session.userData.first_message
					session.endDialog()
				else
					session.beginDialog '/intents'
				return
		]
		@bot.dialog '/intents', @intents

		# Bot intents
		@intents.onDefault [
			(session, args, next) =>
				lang = languages[session.userData.bot_ui_lang]
				session.send languages[session.userData.bot_ui_lang].send_from_source_to_target_language, languages[session.userData.bot_ui_lang][session.userData.translation_order.source], languages[session.userData.bot_ui_lang][session.userData.translation_order.target]
				translator.translate session.message.text, session.userData.translation_order, (message) ->
						if message.success
							session.send '%s', message.text
							return
						else
							session.send lang.send_error
							return
					return
				return
		]	
		@intents.matches languages.intent_change_bot_ui_language, [
			(session) ->
				session.beginDialog '/set-bot-ui-lang'
				return
		]
		# intents for devs
		@intents.matches /\/deleteProfile/, [
			# dialog to delete all user data related to a single user
			# this option is not explicitly explained to the user because its intended to be used mostly for development purposes
			(session) ->
				session.userData = {}
				session.send "userData deleted"
				session.endDialog()
		]
module.exports = Bot