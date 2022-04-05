import mongoose from 'mongoose';

const appello_schema = mongoose.Schema({
    nome: { type: String, required: true},
    data: { type: String, required: true},
    docenti: [{ type: String, required: true}],
    descrizione: { type: String, required: true},
    cfu: { type: Number, required: true},
    corso: { type: String, required: true},
    tipo: { type: String, required: true},
    prenotazioni: [
        {type: Number, required: true}
    ]
});

const Appello = mongoose.model('Appello', appello_schema);

export default Appello;
