import $ from 'jquery';
import page from 'page';
var store = require('store')

const htmlTemplate = () => `
<h1> Benvenuto matricola </h1>
`;

class Home {
    constructor() {
        this.mainElement = document.createElement('div');       
        $(this.mainElement).html(htmlTemplate());
    }
    attach(containerElement) {
        $(containerElement).append(this.mainElement);
    }
}

export default Home;