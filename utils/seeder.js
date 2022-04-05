import mongoose from 'mongoose';
import md5 from 'md5';
import Utente from './utente';
import Appello from './appello';
import config from './config';
import fs from 'fs';

mongoose.connect(config.db);

const p1 = new Promise((resolve) => {
    mongoose.connection.dropCollection('students')
    .catch(function() { 
        // do nothing, probably the collection didn't exist
    })
    .then(function() {
        Utente.create([
            {
                email: "test@example.it",
                firstName: "Giuseppe",
                lastName: "Verdi",
                password: md5('test'),
                matricola: "654321",
                corso: "LM57",
                ruolo: "studente",
                dataNascita: "10/02/1993",
                picture: { 
                    data: fs.readFileSync(__dirname + `/../images/1.jpg`), 
                    contentType: 'image/jpeg'
                } 
            },
            {
                email: "test1@example.it",
                firstName: "Christian",
                lastName: "Londero",
                password: md5('test'),
                matricola: "123456",
                ruolo: "studente",
                corso: "LM56",
                dataNascita: "10/02/1993",
                picture: { 
                    data: fs.readFileSync(__dirname + `/../images/2.jpg`), 
                    contentType: 'image/jpeg'
                } 
            },
            {
                email: "testd1@example.it",
                firstName: "Mario",
                lastName: "Rossi",
                password: md5('test'),
                matricola: "000000",
                ruolo: "admin",
                corso: "tutti",
                dataNascita: "10/02/1993",
                picture: { 
                    data: fs.readFileSync(__dirname + `/../images/2.jpg`), 
                    contentType: 'image/jpeg'
                } 
            }
        ]).then(users => {
            console.log(`${users.length} utenti creati`);
            resolve();
        }).catch((err) => {
            console.log(err);
            resolve();
        });
    });
});


const p2 = new Promise((resolve) => {
    mongoose.connection.dropCollection('appellos')
    .catch(function() { 
        // do nothing, probably the collection didn't exist
    })
    .then(function() {
        Appello.create([
            {
                nome: "Algoritmi e strutture dati",
                data: "24/09/2018",
                docenti: ["Maria Antonietta", "Bred Gaspar"],
                descrizione: "Primo compitino di asd",
                cfu: 12,
                corso: "LM56",
                tipo: "scritto",
                prenotazioni: [112356,124786,121212,147896]
            },
            {
                nome: "Algoritmi e strutture dati",
                data: "26/09/2018",
                docenti: ["Maria Antonietta", "Bred Gaspar"],
                descrizione: "Primo compitino di asd",
                cfu: 12,
                corso: "LM56",
                tipo: "orale",
                prenotazioni: [123456,456123]
            },
            {
                nome: "Calcolo delle probabilità",
                data: "31/09/2018",
                docenti: ["Ruggero Bello"],
                descrizione: "II appello - II sessione",
                cfu: 6,
                corso: "LM56",
                tipo: "scritto",
                prenotazioni: [789456,156423,189486]
            },
            {
                nome: "Linguaggi di programmazione",
                data: "20/09/2018",
                docenti: ["Piergiorgio Matassa"],
                descrizione: "Primo appello LUGLIO",
                cfu: 9,
                corso: "LM56",
                tipo: "scritto",
                prenotazioni: [102348]
            },
            {
                nome: "Linguaggi di programmazione",
                data: "12/09/2018",
                docenti: ["Piergiorgio Matassa"],
                descrizione: "Appello orale LUGLIO",
                cfu: 9,
                corso: "LM57",
                tipo: "orale",
                prenotazioni: [123456,123789,456789,456789]
            },
            {
                nome: "Reti di calcolatori",
                data: "27/09/2018",
                docenti: ["Piergiorgio Matassa"],
                descrizione: "II appello",
                cfu: 9,
                corso: "LM56",
                tipo: "scritto",
                prenotazioni: [123456,123789,456789,456789,456123]
            },
            {
                nome: "Programmazione e laboratorio",
                data: "11/09/2018",
                docenti: ["Andrea Tremor"],
                descrizione: "Primo appello AGOSTO",
                cfu: 12,
                corso: "LM57",
                tipo: "scritto",
                prenotazioni: [123456,123789,456789,456789,456123]
            }
        ]).then(users => {
            console.log(`${users.length} appelli created`);
            resolve();
        }).catch((err) => {
            console.log(err);
            resolve();
        });
    });
});

Promise.all([p1, p2]).then(function() {
    mongoose.connection.close();
});
