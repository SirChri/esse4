import 'semantic-ui-css/semantic.css';
import 'semantic-ui-css/semantic';
import $ from 'jquery';
import page from 'page';
import Login from './login';
import Card from './card';

import Home from './student/home';
import ListaAppelli from './student/lista-appelli';
import ListaPrenotazioni from './student/prenotazioni';
import SingoloAppello from './student/appello';

import CreaAppello from './admin/crea-appello';
import GestisciAppelli from './admin/gestisci-appelli';

var store = require('store')
// scripts
import tablesort from './scripts/tablesort';

const container = document.querySelector(".my-component");
const domain = "http://localhost:3000";


page('/', redirect);
page('/default', redirect);
page('/appelli', appelli);
page('/appelli/:id/', load, appello);
page('/prenotazioni', prenotazioni);

page('/crea-appello', creaAppello);
page('/gestisci-appelli', gestisciAppelli);

page('/login', login);
page('/logout', logout);
page('*', notfound);

// componenti studente
const loginComponent = new Login(), homeComponent = new Home(), listaAppelli = new ListaAppelli(), singoloAppello = new SingoloAppello(), listaPrenotazioni = new ListaPrenotazioni(), card = new Card();

// componenti amministratore
const appelloCreate = new CreaAppello(), manageAppelli = new GestisciAppelli();


function redirect(){
    debugger;
    if (!store.get('logged_in')) {
        window.location.replace(domain + '/login');
    }
    if (store.get('logged_in') && (store.get('user').matricola == 0 || store.get('user').matricola == 1)) {
        window.location.replace('/crea-appello');
    } else {
        window.location.replace('/appelli');
    }
}

/******************************************
 * Inizio PAGINE STUDENTE
 */


function appelli() {
    if (store.get('logged_in')) {
        $("#nav .admin").hide();
        $(container).empty();
        listaAppelli.attach(container);
        updateMenu(".appelli");
    } else {   
        window.location.replace(domain + "/login");
    }
}

// recupero il parametro :id passato nell'url
function load(ctx, next) {
    ctx.appello_id = ctx.params.id;
    next();
}

// lo salvo in una "variabile" e lo passo al metodo attach di singoloAppello
function appello(ctx) {
    const id = ctx.appello_id;
    $("#nav .admin").hide();
    $(container).empty();
    singoloAppello.attach(container, id);
}

function prenotazioni() {
    if (store.get('logged_in')) {
        $("#nav .admin").hide();
        $(container).empty();
        listaPrenotazioni.attach(container);
        updateMenu(".prenotazioni");
    } else {
        window.location.replace(domain + "/login");
    }
}

/**
 * Fine PAGINE STUDENTE
 ************************************************/


/************************************************
 * Crea le pagine per l'
 * AMMINISTRATORE
 */

function creaAppello() {
    if (!store.get("logged_in")) {
        window.location.replace(domain + "/login");
    }

    if (store.get('logged_in') && (store.get('user').matricola == 0 || store.get('user').matricola == 1)) {
        $(container).empty();
        $("#nav .user").hide();
        $("#nav .admin").show();
        appelloCreate.attach(container);
        updateMenu(".crea-appello");
    } else {
        $("#nav .admin").hide();
        window.location.replace(domain + "/default");
    }
}

function gestisciAppelli() {
    if (!store.get("logged_in")) {
        window.location.replace(domain + "/login");
    }
    if (store.get('logged_in') && (store.get('user').matricola == 0 || store.get('user').matricola == 1)) {
        $(container).empty();
        $("#nav .user").hide();
        $("#nav .admin").show();
        manageAppelli.attach(container);
        updateMenu(".gestisci-appelli");
    } else {
        $("#nav .admin").hide();
        window.location.replace(domain + "/default");
    }
}

/**
 * Fine PAGINE AMMINISTRATORE
 ***********************************************/



/***********************************************
 * Inizio PAGINE/FUNZIONI GENERICHE
 */

function login() {
    if (!store.get('logged_in')) {
        $("body").empty();
        loginComponent.attach("body");
    } else {
        page.redirect(domain + "/default");
    }
}

function logout() {
    $("body").empty();
    loginComponent.logout();     
    window.location.replace(domain + "/login");
}

function notfound() {
    $("body").empty();
}

// funzione per generare la card alla destra
function initCard() {
    card.attach(".sticky");
    $('.sticky').sticky({
        context: '#cont',
        offset: 15
  });
}

// funzione per aggiornare l'elemento corrente nel menu
function updateMenu(classname) {
    $("#nav .item").each(function() {
        $(this).removeClass("active")
    });
    $("#nav").find(classname).addClass("active");
}



/**
 * Fine PAGINE/FUNZIONI GENERICHE 
 ******************************************/

if (store.get('logged_in')) {
    initCard();
    $('.tooltip').popup();
}

page.start();