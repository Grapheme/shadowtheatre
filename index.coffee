express  = require "express"
_ 		 = require "underscore"
socketio = require "socket.io"
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
io = socketio.listen(server)


###
# Настройка middleware
###
app.use express.logger "short"
app.use express.bodyParser()
app.use app.router
app.use express.static( __dirname + "/public" )


port = 4000
server.listen(port)

###
# В зависимости от типа устройства отдаем нужную страницу
###
parser = new uaparser()
app.get "/", (req, res) ->
	ua = req.headers['user-agent']
	result = parser.setUA(ua).getResult()

	if result.device.type 
		res.sendfile __dirname + "/public/operator.html"
	else
		res.sendfile __dirname + "/public/index.html" 

###
# Проверка пароля
###
app.post "/password", (req, res, next) ->
	if req.body.password in config.get("passwords")
		return res.json {}

	return next new Error "Wrong password!"

###
# Socket.io stuff
###

# io.sockets.on("connection", function(socket) {
#   socket.on("move", function(data) {
#     socket.broadcast.emit("actuate", data);
#   });
# });

