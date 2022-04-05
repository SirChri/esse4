import $ from 'jquery';
import page from 'page';
var store = require('store')

const newAppello = () => `
<h2 class="ui header">
    <i class="icon book"></i> 
    Crea nuovo appello
</h2>
<div class="ui divider"></div>
<form>
<div class="ui form">
  <div class="fields">
    <div class="eight wide field">
      <label>Nome appello</label>
      <input placeholder="Algoritmi e strutture dati" type="text" name="nome">
    </div>
    <div class="eight wide field">
      <label>Descrizione breve</label>
      <input placeholder="II appello - IV sessione 17/18" type="text" name="descrizione">
    </div>
  </div>
  <div class="fields">
  <div class="four wide field">
    <label>Crediti</label>
    <input placeholder="CFU" type="text" name="cfu">
  </div>
  <div class="four wide field">
    <label>Data</label>
    <input placeholder="gg/mm/aaaa" type="text" name="data">
  </div>
  <div class="four wide field">
    <label>Corso</label>
    <input placeholder="LM68 - Informatica" type="text" name="corso">
  </div>
    <div class="four wide field">
        <label>Tipo</label>
        <div class="field">
            <select class="ui fluid search dropdown" name="tipo">
                <option value="scritto">Scritto</option>
                <option value="orale">Orale</option>
            </select>
        </div>
    </div>
    </div>
    
    <div class="fields">
        <div class="sixteen wide field">
        <label>Elenco docenti (elencare separati dalla virgola: nome,nome,nome,...)</label>
        <input placeholder="nome cognome,nome cognome,..." type="text" name="docenti">
        </div>
    </div>
</div>
</form>
`;

const modal = () => `
<div class="ui mini modal">
  <div class="header">Appello inserito!</div>
  <div class="content">
    <p></p>
  </div>
  <div class="actions">
    <div class="ui approve green button">Prosegui</div>
  </div>
</div>
`;

const buttons = () => `
<div class="ui buttons" style="margin-top: 30px;">
  <button class="ui reset button">Reset Form</button>
  <div class="or"></div>
  <button type="submit" class="ui positive button">Crea Appello</button>
</div>
`;


class CreaAppello {
    constructor() {
        this.mainElement = document.createElement('div');
    }

    attach(containerElement) {
        $(this.mainElement).html(newAppello()).appendTo(containerElement);  
        $('select.dropdown').dropdown();
        $(this.mainElement).after(buttons());
        $(containerElement).find('button[type="submit"]').click(this.submit.bind(this)); 
        $('.reset').on("click", function() {
            $('body').find("form").trigger('reset');
        });
    }

    submit(event) {
        event.preventDefault();
        $(this.mainElement).after(modal());

        $('.mini.modal').modal();
        const send = {};
        $(this.mainElement).find('form').serializeArray().forEach((field) => { 
            send[field.name] = field.value; 
        }); 
        send["cfu"] = parseInt(send["cfu"]);
        send["docenti"] = send["docenti"].split(', ');
        send["prenotazioni"] = [];

        let data = {
            appello: send,
            admin: store.get('user')._id
        };

        fetch('/api/admin/insert', {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + store.get('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.ok) {
                $('.mini.modal').modal('show');
                $('.mini.modal p').text("L'appello è stato inserito correttamente!\n");
                $('.mini.modal .approve').on('click', function(event) {
                    $('.modals').fadeOut(300).remove();
                    $('body').removeClass("dimmable dimmed");
                    $('body').find("form").trigger('reset');
                });
            }  else {
                throw Error(response.statusText);
            }      
        }).then((data) => {
            console.log(data);
        }).catch((error) => {
            $('.mini.modal h2').text("Ops! Errore.");
            $('.mini.modal p').text("Si è verificato un errore.\n" + error);
            $('.mini.modal').modal('show');
            $('.mini.modal .approve').on('click', function(event) {
                $('.modals').fadeOut(300).remove();
                $('body').removeClass("dimmable dimmed");
            });
        });
    }
}

export default CreaAppello; 