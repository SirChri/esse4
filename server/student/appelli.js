import jwt from 'express-jwt';
import { Router } from 'express';
import Appello from '../models/appello';
import config from '../config';

const router = Router();

// protetto
router.use(jwt({ secret: config.secret_key, algorithms: ['HS256']}));

/**
 * per recuperare i dati di un singolo appello
 * usato da: appello.js
 */
router.get('/:id', function(req, res, next) {
    Appello.findOne({ _id: req.params.id }).then(function(appello) {
        if (!appello)
           throw new Error(`Could not find appello ${req.params.id}`);
        console.log(appello);
        res.json(appello.toObject());
    }).catch(function(error) {
        next(new Error(error));
    });
});

/**
 * recupero i dati di tutti gli appelli rispetto al corso dell'utente attuale 
 * e che non siano
 * usato da: lista-appelli.js
 */
router.get('/:corso/:matricola', function(req, res, next) {
    Promise.all([
        Appello.find({corso: req.params.corso, prenotazioni: { "$ne": req.params.matricola }}),
        Appello.count({}),
    ]).then((values) => {
        const appelli = values[0], n_appelli = values[1];
        const result = { 
            appelli: appelli.map((p) => p.toObject({ virtuals: true })),
        };
        result.count = n_appelli;
        res.json(result);
    });
});


export default router;