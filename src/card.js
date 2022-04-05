import $ from 'jquery';
import page from 'page';
var store = require('store')

const htmlTemplate = (result) => `
    ${result.corso != "tutti" ? studentCard(result) : adminCard(result)}
`;

const studentCard = (result) => `

<div class="ui card">
<div class="content">
  <img class="right floated mini ui image" src="${"http://localhost:3000/api/user/" + result.picture_url}">
  <div class="header">
    ${result.firstName} ${result.lastName}
  </div>
  <div class="meta">
    ${result.corso}
  </div>
    <div class="description">
    Bentornato ${result.firstName},<br>
    Sulla piattaforma Esse4 potrai prenotarti a tutti gli appelli disponibili ad oggi, perdopiù hai anche la possibilità di vedere a quali appelli sei già iscritto.
    </div>
  <div class="ui divider"></div>
 &bull; Sei iscritto a <a href="http://localhost:3000/prenotazioni" data-prenotazioni="" id="nprenotazioni" class="tooltip" data-tooltip="Visualizza prenotazioni" data-inverted=""></a> appelli<br />
 &bull; <a href="http://localhost:3000/logout" class="tooltip" data-tooltip="Effettua il logout" data-inverted="">Logout</a>
</div>
</div>

<div class="ui card">
<div class="content">
  <i class="right floated ui question circle outline icon"></i>
  <div class="header">
  Legenda
  </div>
  <div class="meta">
  </div>
    <div class="description">
    In "Appelli" puoi prenotarti a uno degli appelli disponibili e previsti dal tuo corso di laurea cliccando sul libro a fianco di ogni appello. Due tipi di appelli: <br />
    <i class="book icon" style="color: blue"></i> indica un appello ORALE;<br />
    <i class="book icon" style="color: red"></i> indica un appello SCRITTO;<br />
    <div class="ui divider"></div>
    In "Prenotazioni" puoi vedere tutti gli appelli a cui sei prenotato. Puoi disiscriverti usando l'apposito pulsante <i class="icon trash alternate outline"></i>.
    </div>
</div>
</div>
`;

const adminCard = (result) => `
<div class="ui card">
<div class="content">
  <img class="right floated mini ui image" src="${"http://localhost:3000/api/user/" + result.picture_url}">
  <div class="header">
    ${result.firstName} ${result.lastName}
  </div>
  <div class="meta">
    Amministratore
  </div>
    <div class="description">
    Bentornato admin,<br>
    Stavamo giusto aspettando te, qui potrai inserire nuovi appelli per qualsiasi corso oppure cancellare i vecchi appelli.
    </div>
  <div class="ui divider"></div>
  &bull; <a href="http://localhost:3000/logout" class="tooltip" data-tooltip="Effettua il logout" data-inverted="">Logout</a>
</div>
</div>

<div class="ui card">
<div class="content">
  <i class="right floated ui question circle outline icon"></i>
  <div class="header">
  Legenda
  </div>
  <div class="meta">
  </div>
    <div class="description">
    In "Crea Appelli" puoi definire un nuovo appello ad hoc per quasiasi corso dell'ateneo.
    <div class="ui divider"></div>
    In "Gestisci Appelli" puoi cercare tra tutti gli appelli con l'apposito form di ricerca e cancellare un appello cliccando sull'apposito pulsante <i class="icon trash alternate outline"></i>.
    </div>
</div>
</div>
`;


class Card {
    constructor() {
        this.mainElement = document.createElement('div');
        $(this.mainElement).attr("class", "cards");
    }

    attach(containerElement) {
        $(this.mainElement).appendTo(containerElement);     
        this.loadInfo();   
    }

    loadInfo() {
        const url = `/api/user/` + store.get('user').matricola;
        fetch(url, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + store.get('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }}).then((response) => {
            if (response.ok) {
                return response.json();
            }  else          
                throw Error(response.statusText);
        }).then((result) => {
            if (result) {
                console.log(result);
                $(this.mainElement).hide().html(htmlTemplate(result)).fadeIn(200);
                this.loadPrenotazioni();
            }
        }); 
    }

    loadPrenotazioni() {
        const url = `/api/prenota/` + store.get('user').matricola;
        fetch(url, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + store.get('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }}).then((response) => {
            if (response.ok) {
                return response.json();
            }  else          
                throw Error(response.statusText);
        }).then((result) => {
            if (result) {
                $("#nprenotazioni").text(result.count);
                $("#nprenotazioni").attr("data-prenotazioni", result.count);
            }
        }); 
    }
}

export default Card; 