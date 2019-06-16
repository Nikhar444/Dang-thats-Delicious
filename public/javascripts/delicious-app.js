import '../sass/style.scss';
import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
console.log("sachin");
autocomplete( $('#address'), $('#lat'), $('#lng') ); //here $ sign is basically document.querySelector, go and have a look at ./modules/bling