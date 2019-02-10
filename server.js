const express = require('express'), 
    morgan = require('morgan');
const app = express();
var http = require('http').Server(app);
const graphqlHTTP = require('express-graphql');
const cors = require('cors'),
    chalk = require('chalk');
const schema = require('./src/schema/schema');
const io = require('socket.io')(http);
const path = require("path");

exports.startup = (port) =>{
    // use morgan to log requests to the console
    app.use(morgan('dev'));
    app.use(cors());
    
    app.set('etag', false);
    // serve static files from 'public'
    app.use(express.static(path.join(__dirname, './public')));

    app.use('/graphql',graphqlHTTP({
        schema,
        graphiql: true // tool to test
    }));

    app.get('/', function(req, res, next){
        res.status(200);
        res.sendfile(path.join(__dirname,'./public/index.html'));
    });

    var connection = 0;
    io.on('connection',(socket)=>{
        console.log("user connected");
        io.emit('broadcast', ++connection);
        socket.on('disconnect', function() {
            io.emit('broadcast', --connection);
            console.log("disconnect: ", socket.id);
        });
    });

    http.listen(port, ()=>{
        console.log(chalk.blue(`🌏 application is running on port ${port}`));
    });
};


