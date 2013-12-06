express  = require "express"
_ 		 = require "underscore"
uaparser = require "ua-parser-js"
config   = require "nconf"

fs 		 = require "fs"
path 	 = require "path"
http	 = require "http"


###
Настройка конфигурации
### 
config.argv()
	.env()

config.defaults 
	"config-file" : "config.json"

config.file
	file: config.get "config-file"


###
# Настройка веб-сервера
###
app = express()
server = http.createServer(app)


###
# Настройка middleware
###
app.use express.bodyParser()
app.use app.router
app.use express.static( __dirname + "/public" )

port = config.get "http:port"
server.listen port, ->
	console.log "Server listening at #{port}"


###
# В зависимости от типа устройства отдаем нужную страницу
###
parser = new uaparser()
app.get "/", (req, res) ->
	ua = req.headers['user-agent']
	result = parser.setUA(ua).getResult()

	if result.device.type
		res.sendfile __dirname + "/public/index.html"  
	else
		res.sendfile __dirname + "/public/operator.html"

###
# Проверка пароля
###
app.post "/password", (req, res, next) ->
	if req.body.password in config.get("passwords")
		return res.json {}

	return next new Error "Wrong password!"


###
# Смена сообщения оператора
###
currentMessage = ""
app.get "/message", (req, res) ->
	res.json 
		message : currentMessage

app.post "/message", (req, res) ->
	currentMessage = req.body.message
	res.json {}


