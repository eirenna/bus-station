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
    yearSuffix: ''
});
