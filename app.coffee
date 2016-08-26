Botranslator = require './libs/botranslator'
restify = require 'restify'

server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, -> 
	console.log '%s listening to %s', server.name, server.url
);

# Create chat bot

# Production connector
connector = new builder.ChatConnector(
	appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD
);

bot = new Botranslator connector

server.post '/api/messages', connector.listen()