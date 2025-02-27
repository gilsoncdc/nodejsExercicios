// variavel de ambiente
require('dotenv').config();
const express = require('express');
const app = express();
// modelação da bases de dados no mongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    app.emit('pronto');
})
.catch(e => console.log(e));
// identificar o navegador do cliente
const session = require('express-session');
const MongoStore = require('connect-mongo'); //(session);
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middleware/middleware');

app.use(helmet());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve(__dirname, 'public')));
const sessionOption = session({
    secret: 'akakdsfebfhsdhbdabshdbhasbdhbd  qwf qwe dnjd uhrjn efjenfjenjf a8()',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOption); 
app.use(flash());
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs'); // renderizar a view
app.use(csrf());
app.use(middlewareGlobal); 
app.use(checkCsrfError); 
app.use(csrfMiddleware);
app.use(routes);
app.on('pronto', () => {
    app.listen(3000, () => { 
        console.log('Acessar http://localhost:3000');
        console.log('servidor na porta 20000');
    });
});

/* app.get('/test/:idUser', (req, resp) => {
//     console.log(req.params); // parametro da url
//     resp.send(req.query.idUser); // mais de um parametro com chave valor
// })

// app.post('/', (req, resp) => {
//     console.log(req.body);
//     resp.send('Recebi o formulario com o nome ' + req.body.nome);
});*/ 





