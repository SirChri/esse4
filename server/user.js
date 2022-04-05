import { Router } from 'express';
import Utente from './models/utente';
import config from './config';

const router = Router();


router.get('/:matricola/picture', function(req, res, next) {
    Utente.findOne({ matricola: req.params.matricola }, { picture: 1 }).then(function(student) {
        if (!student)
            throw new Error(`Could not find student ${req.params.matricola}`);
        res.contentType(student.picture.contentType);
        res.send(student.picture.data);
    }).catch(function(error) {
        next(new Error(error));
    });
});

router.get('/:matricola', function(req, res, next) {
    Utente.findOne({ matricola: req.params.matricola }, { picture: 0 }).then(function(student) {
        if (!student)
           throw new Error(`Could not find student ${req.params.matricola}`);
        res.json(student.toObject({ virtuals: true }));
    }).catch(function(error) {
        next(new Error(error));
    });
});

export default router;