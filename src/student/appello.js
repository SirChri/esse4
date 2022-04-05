import $ from 'jquery';
import page from 'page';
var store = require('store')

const htmlTemplate = (result) => `
<h2 class="ui header">
  <i class="bookmark icon"></i>
  <div class="content">
    Visualizza Appello
  </div>
</h2>

<table class="ui table">
  <tbody>
    <tr>
      <td>
        <i class="edit icon" style="margin-right: 15px;"></i> Nome:
      </td>
      <td>${result.nome}</td>
    </tr>
    <tr>
      <td>
        <i class="calendar alternate outline icon" style="margin-right: 15px;"></i> Data:
      </td>
      <td>${result.data}</td>
    </tr>
    <tr>
      <td>
        <i class="trophy icon" style="margin-right: 15px;"></i> Crediti:
      </td>
      <td>${result.cfu}</td>
    </tr>
    <tr>
      <td>
        <i class="font icon" style="margin-right: 15px;"></i> Tipo:
      </td>
      <td>${result.tipo}</td>
    </tr>
    <tr>
      <td>
        <i class="university icon" style="margin-right: 15px;"></i> Corso:
      </td>
      <td>${result.corso}</td>
    </tr>
    <tr>
      <td>
        <i class="users icon" style="margin-right: 15px;"></i> Docenti:
      </td>
      <td>${result.docenti}</td>
    </tr>
    <tr>
        <td class="collapsing">
        <i class="file alternate outline icon" style="margin-right: 15px;"></i> Descrizione:
      </td>
      <td>${result.descrizione}</td>
    </tr>
    <tr>
        <td >
        <i class="address book outline icon" style="margin-right: 15px;"></i> N. Iscritti:
      </td>
      <td id="iscritti"></td>
    </tr>
  </tbody>
</table><br>
`;

const modal = () => `
<div class="ui mini modal">
  <div class="header">Prenotazione effettuata!</div>
  <div class="content">
    <p>Ora pensa a studiare <i class="icon graduation cap"></i></p>
  </div>
  <div class="actions">
    <div class="ui approve green button">Prosegui</div>
  </div>
</div>
`;

class SingoloAppello {
    constructor() {
        this.idexam = "";
        this.mainElement = document.createElement('div');
    }

    attach(containerElement, param) {
        this.idexam = param;
        $(this.mainElement).html(htmlTemplate([]));
        $(this.mainElement).appendTo(containerElement);        
        this.loadAppello();
        $(this.mainElement).after(modal());
        $('.mini.modal').modal();
        $(this.mainElement).after("<button type=\"submit\" class=\"ui green button\">Prenotati</button>");
        $(containerElement).find('button[type="submit"]').click(this.submit.bind(this)); 
    }

    loadAppello() {
        const url = `/api/appelli/` + this.idexam;
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
                //console.log(result.prenotazioni.length);
                $(this.mainElement).html(htmlTemplate(result)).fadeIn(200);
                $("#iscritti").html(result.prenotazioni.length);
            }
        }); 
    }
    

    submit(event) {
        event.preventDefault();
        let data = {
            id: this.idexam,
            student: store.get('user').matricola,
        };
        fetch('/api/prenota', {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + store.get('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.ok) {
                $('.mini.modal')
                    .modal('show')
                ;
                $('.mini.modal .approve').on('click', function(event) {
                    $('.modals').remove();
                    window.location.replace("http://localhost:3000/prenotazioni");
                });
            }  else {
                throw Error(response.statusText);
            }      
        }).then((data) => {
            //console.log(data);
        }).catch((error) => {
            $('.mini.modal .header').text("Si è verificato un errore.\n");
            $('.mini.modal p').text(error);
            $('.mini.modal').modal('show');
            $('.mini.modal button').removeClass('green').addClass('red');
            $('.mini.modal .approve').on('click', function(event) {
                $('.modals').remove();
                $('body').removeClass("dimmable dimmed");
            });
        });
    }
}

export default SingoloAppello; 