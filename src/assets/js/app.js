import $ from 'jquery';
import 'what-input';

// Foundation JS relies on a global varaible. In ES6, all imports are hoisted
// to the top of the file so if we used`import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
// require('foundation-sites');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
import './lib/foundation-explicit-pieces';

import './lib/slick.min.js';

import datepicker from '@chenfengyuan/datepicker';

$(document).foundation();

//Change direction
let changeDirectionBtn = document.querySelector('.ba-direction-btn');

function changeDirection() {
    let from = document.querySelector('[name="from"]');
    let fromVal = from.value;
    let to = document.querySelector('[name="destination"]');
    let toVal = to.value;
    let btn = document.querySelector('.ba-direction-btn__img');

    btn.classList.toggle('ba-rotate');
    from.value = toVal;
    to.value = fromVal;
    
}


//Datepicker settings
changeDirectionBtn.addEventListener('click', changeDirection);
let today = new Date();


$('[data-toggle="datepicker"]').datepicker({
    format: 'dd.mm.YYYY',
    days: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'],
    daysShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    daysMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    months: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
    monthsShort: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
    weekStart: 1,
    startView: 0,
    yearFirst: false,
    yearSuffix: '',
    startDate: today
});


//Open and hide search result details
let resultCard = $('.ba-result-card');


resultCard.find('.ba-more-button').on('click', function(e){
    e.preventDefault();
    let chosenCard = $(this).closest(resultCard);
    
    
    chosenCard.find('.ba-result-card__details').slideToggle();
    chosenCard.find('.ba-result-card__main').toggleClass('ba-result-card__main--opened');
    $(this).toggleClass('ba-more-button--opened');
});

//Search from json file
let searchForm = document.querySelector('.ba-search-form');

let citiesList = new XMLHttpRequest();

citiesList.onload = function () {
    // If bad request exit from function
		if (citiesList.status !== 200) {
			return;
        }
    //Make object from string
    let citiesTotal = JSON.parse(citiesList.responseText);
    console.log(citiesTotal);
    
}

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();    

	citiesList.open("GET", "../data/cities.json"); //Set AJAX request
	citiesList.send(); //Send AJAX request
});