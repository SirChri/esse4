import $ from 'jquery';
import page from 'page';
var store = require('store')

const htmlTemplate = () => `
<div class="column">
  <h2 class="ui teal image header">
    <i class="icon server"></i>
    <div class="content">
      Login Esse4
    </div>
  </h2>
  <form class="ui large form">
    <div class="ui stacked segment">
      <div class="field">
        <div class="ui left icon input">
          <i class="user icon"></i>
          <input name="matricola" placeholder="Numero matricola" type="text">
        </div>
      </div>
      <div class="field">
        <div class="ui left icon input">
          <i class="lock icon"></i>
          <input name="password" placeholder="Password" type="password">
        </div>
      </div>
      <button type="submit" class="ui fluid large teal submit button">Login</button>
    </div>

    <div class="ui error message"></div>

  </form>
</div>
`;

const style = () => `
<style>
  body > .grid {
    height: 100%;
  }
  .image {
    margin-top: -100px;
  }
  .column {
    max-width: 450px;
  }
  </style>
  `;

class Login {
    constructor() {
        this.mainElement = document.createElement('div');
        $(this.mainElement).attr("class", "ui middle aligned center aligned grid"); 
        $(this.mainElement).html(htmlTemplate());
    }
    attach(containerElement) {
        $(containerElement).append(style());   
        $(containerElement).append(this.mainElement);
        // these settings should be here, if not they will not work because the DOM is not mounted
        $(this.mainElement).find('.error').hide();
        $(this.mainElement).find('button[type="submit"]').click(this.submit.bind(this));        
    }
    submit(event) {
        event.preventDefault();
        const data = {};
        $(this.mainElement).find('form').serializeArray().forEach((field) => { 
            data[field.name] = field.value; 
        }); 
        fetch('/api/login', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }  else          
                throw Error(response.statusText);
        }).then((data) => {
            store.set('logged_in', true);
            store.set('token', data.token);
            store.set('user', data.user);
            $(this.mainElement).find('form input').val("");
            // goes back to the previous URL (i.e., the page where Login was pressed)
              window.location.replace("http://localhost:3000/default");
        }).catch((error) => {
            console.log(error);
            $(this.mainElement).find('form').addClass('error');
            $(this.mainElement).find('form .message').text(error.message);
            $(this.mainElement).find('form .message').show();
            $(this.mainElement).find('form .message').fadeOut(5000);
        });
    }
    
    logout() {
        store.remove('logged_in');
        store.remove('token');
        store.remove('user');
    }
}

export default Login;