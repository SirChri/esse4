import jwt from 'express-jwt';
import { Router } from 'express';
import Appello from '../models/appello';
import Utente from '../models/utente';
import config from '../config';

const router = Router();

// protetto
router.use(jwt({ secret: config.secret_key, algorithms: ['HS256']}));
/**
 * eseguo una prenotazione
 * utilizzato in: crea-appello.js
 */
router.post('/insert', function(req, res, next) {
    Promise.all([
        Utente.findOne({_id: req.body.admin}),
    ]).then((values) => {
        if (values[0].ruolo != "admin") {
            const error = "Non sei amministratore.";
            res.statusMessage = error;
            next(new Error(error));
        } else {
            Appello.create(req.body.appello, function (err, small) {
                if (err) {    
                    const error = "Controlla i campi.";
                    res.statusMessage = error;
                    next(new Error(error));
                } else {
                //console.log("creato!!");
                    res.status(200).json({ok: true});
                }
            })
        }
    }).catch(function(error) {
        res.status(500).send(error);
        next(new Error(error));
    });
});

router.post('/remove', function(req, res, next) {
    Promise.all([
        Utente.findOne({_id: req.body.admin}),
    ]).then((values) => {
        if (values[0].ruolo != "admin")
           throw new Error(`Si è verificato un errore.`);
        
        Appello.remove({ _id: req.body.id }, function(err) {
            if (err) {
                throw new Error(`Si è verificato un errore.`);
            } else {
                res.json({ok: true});
            }
        });     
    }).catch(function(error) {
        res.status(500).send(error);
        next(new Error(error));
    });
});


router.get('/lista-appelli/:id', function(req, res, next) {
    Promise.all([
        Utente.findOne({_id: req.params.id}),
        Appello.find({})
    ]).then((values) => {
        if (values[0].ruolo != "admin")
           throw new Error(`Si è verificato un errore.`);
        
        const appelli = values[1];
        const result = { 
            appelli: appelli.map((p) => p.toObject())
        };
        res.json(result.appelli);
    }).catch(function(error) {
        res.status(500).send(error);
        next(new Error(error));
    });
});

export default router;