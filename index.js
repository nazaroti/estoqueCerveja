const express = require("express");
const app = express();
const { engine } = require('express-handlebars');
const bodyparser = require('body-parser');
const Post = require('./models/post');

// Config   
//Template Engine
app.engine('handlebars', engine({
    defaultLayout: 'main', runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.set('view engine', 'handlebars');

//body-parser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//Rotas

//Renderizar o formulario
app.get('/', function (req, res) {
    Post.findAll().then(function (posts) {
        res.render('formulario');
    })
});


//Operacoes
app.post('/operacao', async (req, res) => {
    const { action, estilo, tamanho, quant } = req.body;
    try {
        switch (action) {
            case 'consumo':
                const post = await Post.findOne({ where: { nome: estilo } });
                const novaQuant = post.quantidade - (tamanho * quant);
                await Post.update({ quantidade: novaQuant }, { where: { nome: estilo } });
                break;
            case 'adicionar':
                const post1 = await Post.findOne({ where: { nome: estilo } });
                const novaQuant1 = post1.quantidade + (tamanho * quant);
                await Post.update({ quantidade: novaQuant1 }, { where: { nome: estilo } });
                break;
            case 'chegando':
                const novaQuant2 = (tamanho * quant);
                await Post.update({ quantidade: novaQuant2 }, { where: { nome: estilo } });
                break;
            default:
                res.status(400).send('Ação desconhecida.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocorreu um erro ao processar a operação.');
    }
});

//Pesquisar a quantidade de cerveja
app.get('/pesquisar/', function (req, res) {
    const postId = req.query.id;
    Post.findAll({ where: { id: postId } })
        .then(function (posts) {
            res.render('formulario', { posts: posts });
        })
});


app.listen(8081, function () {
    console.log("Servidor Rodando Família");
}).on('error', function (err) {
    console.log("Erro ao iniciar o servidor:", err);
});

