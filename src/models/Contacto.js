const mongoose = require('mongoose');
const validator = require('validator');
const { use } = require('../../routes');

const ContactoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    sobrenome: {type: String, required: false, default: ''},
    email: {type: String, required: false, default: ''},
    telefone: {type: String, required: false, default: ''},
    criadoEm: {type: Date, default: Date.now}
});

const ContactoModel = mongoose.model('Contacto', ContactoSchema);

function Contacto(body){
    this.body = body;
    this.errors = [];
    this.contacto = null;
};

Contacto.buscaPorId = async function(id){
    if(typeof id !== 'string') return;
    const contacto = await ContactoModel.findById(id);
    return contacto;
};

// metodo estatico
Contacto.buscaContactos = async function(){
    const contactos = await ContactoModel.find()
    .sort({ criadoEm: -1 });
    return contactos;
};

Contacto.prototype.register = async function (){
    this.valida();

    if(this.errors.length > 0) return;
    this.contacto = await ContactoModel.create(this.body);
};

Contacto.prototype.valida = function() {
    this.cleanUp();
    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email invalido');
    if(!this.body.nome) this.errors.push('Nome é um campo obrigatorio');
    if(!this.body.email && !this.body.telefone){
        this.errors.push('Pelo menos um contacto deve ser enviado: telefone ou email');
    } 
    
};

Contacto.prototype.cleanUp = function() {
    for(const key in this.body){
        if(typeof this.body[key] !== 'string'){
            this.body[key] = '';
        }
    }

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone
    };
};

Contacto.prototype.edit = async function(id){

    if(typeof id !== 'string') return;
    this.valida();
    if(this.errors.length > 0) return;

    this.contacto = await ContactoModel.findByIdAndUpdate(id, this.body, { new: true });
    
};

Contacto.delete = async function(id){
    if(typeof id !== 'string') return;
    const contacto = await ContactoModel.findOneAndDelete({_id: id});
    return contacto;
};

module.exports = Contacto;