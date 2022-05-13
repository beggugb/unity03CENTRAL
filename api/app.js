import http from 'http'
import express from 'express'
import logger from 'morgan'
import routes from './server/routes'
const port = 4001;
const host = '192.168.0.100';
const cors = require('cors')

var app = express();
var server = http.createServer(app)

app.use('/api/static',express.static(__dirname + '/public'));
app.use(logger('dev'))
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
app.use(cors());

routes(app);
app.get('*', (req, res) => 
  res.status(200).send({
	  message: "Welcome Central UNITY"
}))

server.listen(port, host, () =>{
	console.log(`Server is runing ar http://${host}:${port}/`)
})
