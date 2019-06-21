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

changeDirectionBtn.addEventListener('click', changeDirection);

//Datepicker settings
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


//Slider
let blogSlider = $('.ba-blog-slider');

blogSlider.slick({
    slide: '.ba-post',
    //autoplay: true,
    dots: true,
    nextArrow: blogSlider.find('[data-next]'),
    prevArrow: blogSlider.find('[data-prev]'),
    mobileFirst: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [{
        breakpoint: 640,
        settings: {
            slidesToShow: 2
        }
    }]
});


////Search from json file///////////////
let searchForm = document.querySelector('.ba-search-form');
let departureCity = searchForm.querySelector('[name="from"]');
let arrivalCity = searchForm.querySelector('[name="destination"]');
let date = searchForm.querySelector('[name="date"]');
let seatsQty = searchForm.querySelector('[name="seats-quantity"]');


function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

//Declare new request
let routes = new XMLHttpRequest();


//Get data from address bar
let from = getUrlParameter('from');
let destination = getUrlParameter('destination');
let searchDate = getUrlParameter('date');
let seats = getUrlParameter('seats-quantity');

//When have all data, write it to the serach form's fields and make search
if (from && destination && searchDate && seats) {
    departureCity.value = from;
    arrivalCity.value = destination;
    date.value = searchDate;
    seatsQty.value = seats;
    showResults();
}



function searchFinalRoute(from, to, array) {
    let finalRoute = [];
    let intermediateRoute = [];

    for (let i = 0; i < array.length; i++) {
        if (array[i].city == from) {
            intermediateRoute = array.slice(i, array.length);
            
        }
    }

    if (intermediateRoute.length > 0) {
        for (let j = 0; j < intermediateRoute.length; j++) {
            if (intermediateRoute[j].city == to) {
                finalRoute = intermediateRoute.slice(0, (j + 1));
            }
        }
    }  else {
        return;
    }

    if(finalRoute.length > 0) {         
        return true;
    }
}



function findMatches(from, destination, cities) {
    return cities.filter(place => {
        if (searchFinalRoute(from, destination, place.route)) {
            return place;
        }
        
    });

}

routes.onload = function () {
    // If bad request exit from function
    if (routes.status !== 200) {
        return;
    }
    //Make object from string
    let routesList = JSON.parse(routes.responseText);
    //Check if wanted departure and arrival points equal to race departure and arrival points

    const resultRoutes = findMatches(departureCity.value, arrivalCity.value, routesList);

    let resultCardTmpl = document.getElementById('result').innerHTML;

    let searchResults = document.querySelector('.ba-search-results');
    searchResults.innerHTML = '';
    resultRoutes.forEach(route => {
        let resultHTML = resultCardTmpl
            .replace(/⏰departure⏰/ig, route.departure)
            .replace(/⏰arrival⏰/ig, route.arrival)
            .replace(/⏰race-number⏰/ig, route.trip)
            .replace(/⏰departuretime⏰/ig, route.departuretime)
            .replace(/⏰departureStation⏰/ig, route.departureStation)
            .replace(/⏰time⏰/ig, route.time)
            .replace(/⏰arrivalStation⏰/ig, route.arrivalStation)
            .replace(/⏰cost⏰/ig, route.cost)
            .replace(/⏰arrivaltime⏰/ig, route.arrivaltime)
            .replace(/⏰carrier⏰/ig, route.carrier)
            .replace(/⏰bus⏰/ig, route.bus);

        searchResults.innerHTML += resultHTML;
    });

    //Open and hide search result details
    let resultCard = $('.ba-result-card');

    resultCard.find('.ba-more-button').on('click', function (e) {
        e.preventDefault();
        let chosenCard = $(this).closest(resultCard);


        chosenCard.find('.ba-result-card__details').slideToggle();
        chosenCard.find('.ba-result-card__main').toggleClass('ba-result-card__main--opened');
        $(this).toggleClass('ba-more-button--opened');
    });
}

let searchFormAJAX = document.getElementById('search-form');

function showResults(e) {
    if (e)
        e.preventDefault();

    routes.open("GET", "data/cities.json"); //Set AJAX request
    routes.send(); //Send AJAX request
}
searchFormAJAX.addEventListener('submit', showResults);