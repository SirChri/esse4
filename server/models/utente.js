import mongoose from 'mongoose';

const utente_schema = mongoose.Schema({
    email: { type: String, required: true, match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    matricola: { type: Number, required: true},
    corso: { type: String, required: true},
    ruolo: { type: String, required: true },
    dataNascita: {type: String, required: true},
    picture: { data: Buffer, contentType: String }
});

utente_schema.virtual('picture_url').get(function() {
    return this.matricola + '/picture';
});

const Utente = mongoose.model('Utente', utente_schema);

export default Utente;
