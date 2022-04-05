import $ from 'jquery';
import page from 'page';
var store = require('store')

const listaAppelli = (appelli) => `
<h2 class="ui header">
<i class="book icon"></i>
<div class="content">
  Lista Appelli
</div>
</h2>
<div class="ui divider"></div>

<div class="ui disabled text loader">Loading</div>
<table class="ui sortable celled table"">
<thead>
  <tr>
      <th></th>
      <th>Nome</th>
      <th>Data</th>
      <th>Corso</th>
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
    <td><a href="#" data-appello="${appello._id}" class="remove-appello tooltip" data-tooltip="Elimina appello" data-inverted=""><i class="icon trash alternate outline"></i></a></td>
    <td class="name">${appello.nome}</td>
    <td class="date">${appello.data}</td>
    <td>${appello.corso}</td>
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

const modal = () => `
<div class="ui basic modal">
    <div class="ui icon header">
      <i class="trash alternate outline icon"></i>
      Rimuovere l'appello: <span id="exam"></span>
    </div>
    <div class="ui content grid centered">
      <p>Sei sicuro di voler cancellare l'appello? Tutti i dati andranno persi riguardo le prenotazioni.</p>
    </div>
    <div class="ui actions grid centered">
      <div class="ui red basic cancel inverted button">
        <i class="remove icon"></i>
        No
      </div>
      <div class="ui green ok inverted button">
        <i class="checkmark icon"></i>
        Si
      </div>
    </div>
  </div>
`;



class GestisciAppelli {
    constructor() {
        this.mainElement = document.createElement('div');
    }

    attach(containerElement) {
        $(this.mainElement).appendTo(containerElement); 
        this.loadAppelli();
    }

    removeButton() {
        let main = this.mainElement;
        $(".remove-appello").on("click", function(e) {
            e.preventDefault();

            $(main).after(modal());
            $('.basic.modal').modal();
            $('.basic.modal').modal('setting', 'closable', false).modal('show');
            $("#exam").html(`<br />` + $(this).parent().parent().find(".name").html() + ` del ` + $(this).parent().parent().find(".date").html());

            let appello = $(this).attr('data-appello');
            const row = $(this).parent().parent();
            

            $('.basic.modal .ok').on("click", function() { 
                let data = {
                    id: appello,
                    admin: store.get('user')._id
                };
                fetch(`/api/admin/remove`, {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + store.get('token'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify(data)
                    }).then((response) => {
                    if (response.ok) {
                        return response.json();
                    }  else          
                        throw Error(response.statusText);
                }).then((result) => {
                    $('.modals').fadeOut(300);
                    $('.modals').remove();
                    $('body').removeClass("dimmable dimmed");
                    if (result) {
                        $(row).fadeOut(300);
                    }
                }); 
            });
            $('.basic.modal .cancel').on("click", function() {
                $('.modals').fadeOut(300);
                $('.modals').remove();
                $('body').removeClass("dimmable dimmed");
            });
        });
    }

    
    loadAppelli() {
        const url = `/api/admin/lista-appelli/` + store.get('user')._id;
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
                $(this.mainElement).hide().html(listaAppelli(result)).fadeIn(200);
                $("table").tablesort();
                this.removeButton();
            }
        }); 
    }
}

export default GestisciAppelli; 