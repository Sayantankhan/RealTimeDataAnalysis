const {EventEmitter} = require('events'), 
    event = new EventEmitter();
const mongoose = require('mongoose');
const chalk = require('chalk');
const config = require('./config/config');
const server = require('./server'),
    handler = require('./handler/processHandler');
const port = process.env.PORT || config.port;

mongoose.connect(config.mongoUrl,{ useNewUrlParser: true })
mongoose.connection.once('open',()=>{
    event.emit('DBUP')
})

event.on('DBUP', ()=>{
    console.log(chalk.blue("Database Connected"));
    server.startup(port);
})