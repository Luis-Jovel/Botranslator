Botranslator = require './libs/botranslator'
builder = require 'botbuilder'
# development connector
connector = new builder.ConsoleConnector().listen()

bot = new Botranslator connector
