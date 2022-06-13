import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
}

refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY))

function onInput(event) {
  const inputValue = event.target.value.trim();

  if (inputValue !== '') {
    fetchCountries(inputValue)
    .then(countries => {
      
      if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
      }
      
      if (countries.length <= 10) {
        const createCountryList = countries.map(renderCountryListItem).join("");
        refs.countryList.innerHTML = createCountryList;
        refs.countryInfo.innerHTML = '';
      }

      if (countries.length === 1) {
        const createCountryInfo = countries.map(renderCountryInfoCard);
        refs.countryInfo.innerHTML = createCountryInfo;
        refs.countryList.innerHTML = '';
      } 
    })
    .catch(error => {
      Notiflix.Notify.failure(error);
    });
  }
  
}


function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
    .then(response => {
      if (response.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      return response.json()
    })
    .catch(error => {
      Notiflix.Notify.failure(error);;
    });
}

function renderCountryInfoCard({ name: { common }, capital, population, flags: { svg }, languages }) {
  return `<div class="country-info__header">
      <img class="flag-image" src="${svg}" alt="flag">
      <h2 class="country-info__name">${common}</h2>
    </div>
    <p class="country-info__data">Capital:<span>${capital}</span></p>
    <p class="country-info__data">Population:<span>${population}</span></p>
    <p class="country-info__data">Languages:<span>${Object.values(languages)}</span></p>`;
}

function renderCountryListItem({ name: { common }, flags: { svg } }) {
  return `<li class="country-list__item"><img class="flag-image" src="${svg}" alt="flag"><p class="country-list__name">${common}</p></li>`;
}





