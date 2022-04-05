import jwt from 'jsonwebtoken';
import { Router } from 'express';
import Utente from './models/utente';
import md5 from 'md5';
import config from './config';

const router = Router();

router.post('/', function(req, res, next) {
    const data = req.body;
    Utente.findOne({ matricola: data.matricola, password: md5(data.password) }, { matricola: 1, name: 1, corso: 1 })
    .then(function(user) {   
        if (user) {
            const token = jwt.sign(user.toObject(), config.secret_key);
            res.status(200).json({ token, user });
        } else {
            const error = "Wrong credentials.";
            res.statusMessage = error;
            res.status(403).send(error);
            next(new Error(error));
        }
    }).catch(function(error) {
        res.status(500).send(error);
        next(new Error(error));
    });
});

export default router;