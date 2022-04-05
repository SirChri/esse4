import jwt from 'express-jwt';
import { Router } from 'express';
import Appello from '../models/appello';
import config from '../config';

const router = Router();

// protetto
router.use(jwt({ secret: config.secret_key, algorithms: ['HS256']}));
/**
 * eseguo una prenotazione
 * usato da: appello.js 
 */
router.post('/', function(req, res, next) {
    Appello.findOneAndUpdate({_id: req.body.id}, {$push: {prenotazioni: req.body.student}}).then(function(appello) {
        if (!appello)
           throw new Error(`Si è verificato un errore.`);
        res.json({ok: true});
    }).catch(function(error) {
        next(new Error(error));
    });
});


/**
 * rimuovo una prenotazione
 * usato da: prenotazioni.js
 */
router.post('/remove', function(req, res, next) {
    Appello.findOneAndUpdate({_id: req.body.id}, {$pull: {prenotazioni: req.body.student}}).then(function(appello) {
        if (!appello)
           throw new Error(`Si è verificato un errore.`);
        res.json({ok: true});
    }).catch(function(error) {
        next(new Error(error));
    });
});

/**
 * ricava tutte le prenotazioni dato il numero di matricola
 * usato da: prenotazioni.js, card.js
 */
router.get('/:matricola', function(req, res, next) {
    Promise.all([
        Appello.find({prenotazioni: req.params.matricola}),
        Appello.count({prenotazioni: req.params.matricola})
    ]).then((values) => {
        const prenotazioni = values[0], n_appelli = values[1];
        const result = { 
            prenotazioni: prenotazioni.map((p) => p.toObject({ virtuals: true })),
        };
        result.count = n_appelli;
        res.json(result);
    });
});


export default router;