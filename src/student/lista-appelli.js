import $ from 'jquery';
var store = require('store')

const htmlTemplate = (appelli) => `
<h2 class="ui header">
  <i class="university icon"></i>
  <div class="content">
    Lista Appelli
  </div>
</h2>
<div class="ui divider"></div>
<p>La pagina mostra gli appelli disponibili alla data odierna per le sole attività già presenti nel proprio piano di studi.</p>
<p>Se alcuni appelli non fossero visibili, ti preghiamo di verificare la correttezza e la completezza del tuo piano di studi e di segnalare eventuali incongruenze alla Segreteria Studenti.</p>
<div class="ui disabled text loader">Loading</div>
<table class="ui sortable celled table">
  <thead>
    <tr>
        <th></th>
        <th>Nome</th>
        <th>Data</th>
        <th>Descrizione</th>
        <th>Docenti</th>
        <th>Tipo</th>
        <th>CFU</th>
    </tr>
    </thead>
  <tbody>
  ${appelli.map(
      appello => `
      <tr>
      <td class="collapsing"><a style="color: ${appello.tipo == "scritto" ? `red` : `blue` }" href="/appelli/${appello._id}" class="tooltip" data-tooltip="Visualizza appello" data-inverted=""><i class="book icon"></i></a></td>
      <td>${appello.nome}</td>
      <td>${appello.data}</td>
      <td>${appello.descrizione}</td>
      <td>${appello.docenti.join(', ')}</td>
      <td>${appello.tipo}</td>
      <td>${appello.cfu}</td>
      </tr>
      `
  ).join('')}
  </tbody>
</table>
`;

class ListAppelli {
    constructor() {
        this.appelli = [];
        this.mainElement = document.createElement('div');
    }

    attach(containerElement) {
        $(this.mainElement).html(htmlTemplate([])).appendTo(containerElement);        
        this.loadAppelli();
    }

    loadAppelli() {
        const url = `/api/appelli/` + store.get("user").corso + `/` + store.get("user").matricola;
        $(this.mainElement).find('.loader').removeClass("disabled").addClass("active");
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
                $(this.mainElement).hide().html(htmlTemplate(result.appelli)).fadeIn(200);
                $("table").tablesort();
            }
        }); 
    }

}

export default ListAppelli; 