// TypeLess Function Init 
//
// -- Query Element
// Querying with QuerySelector taken too much needs of typing
// It will be better to make an alias for each of them
const $ = (item) => {return document.querySelector(item)};
const $_ = (item) => {return document.querySelectorAll(item)};
const $$ = (cont, item) => {return cont.querySelector(item)};
const $$_ = (cont, item) => {return cont.querySelectorAll(item)};
//
// -- Set delay on async function
const delay = (time) => {return new Promise(resolve => setTimeout(resolve, time));} 
//
// -- Set display by changing element's inner HTML
const $fill = (item, text) => {item.innerHTML = text;} 

// Global valid values
const valid = {
  age: 18,
  weight: 10,
  height: 50,
}

// Adjustment of Header
// -if Mobile View => Move left
//
if(window.innerWidth < 768) {
  $('text').setAttribute('x','25px')
}

// Animation for swap 
// -Welcome => Calculator Page View
//
// Swipe off, then it goes whoop
$('#exp').addEventListener('click', async () => {
  $('#welcome').style.translate = '100vw 0';

  await delay(200);
  $('main').style.translate = `0 ${($('#welcome').offsetHeight - 100) * -1}px`;
  $('header').style.boxShadow = '0 0 10px rgba(0,0,0,.2)';
  $('header').style.backgroundColor = 'white';

  await delay(800);
  $('main').style.backgroundColor = 'white';
});

// Animation for swap 
// -Calculator Page View => Welcome
//
$('header').addEventListener('click', () => {
  $('#welcome').removeAttribute('style');
  $('header').removeAttribute('style');
  $('main').removeAttribute('style');
})

// Reset input field button => Clears up anything in the fieldset
$('#reset').addEventListener('click', async () => {
  $_('input').forEach((input) => {
    input.value = '';       // Reset input[number]
    input.checked = false;  // Reset input[radio]
  })
})

// Recolor on input fills while validating the inputs
// if !valid => mark it's input field with red color
//
// -- Number Input
//
// Query all the .number element    
// Add on-input event for each of them.ne
// It will triggered if it doesn't meet required value

const number = $_('.number');
number.forEach((input,i) => {
  input.addEventListener('input', () => {
    input.removeAttribute('style');
    if (!input.value) input.style.borderColor = 'red';
    if (i == 0 && input.value < valid.weight) input.style.borderColor = 'red';
    if (i == 1 && input.value < valid.age) input.style.borderColor = 'red';
    if (i == 2 && input.value < valid.height) input.style.borderColor = 'red';
  })
})

// Recolor on input fills while validating the inputs
// if !valid => mark it's input field with red color
//
// -- Radio Input
//
// Query all the .radio element    
// Add on-click event for each of them. 
// It will be all side red border if it was unchecked later

const radios = $_('.radio');
radios.forEach(radio => { 
  radio.addEventListener('click', () => {
    $_('.gender').forEach(item => {item.style.borderColor= 'transparent'})
  })
})

// Slide-in Animation 
// -- Result Section of Calculation
//
const expandRes = async () => {
  const res = $('#res');
  const pre = $('.preload');
  if (window.innerWidth < 992) {
    res.style.display = 'block';
    pre.style.display = 'flex';
  }

  await delay(10);
  res.style.translate = '0';
  $$(res,'.box').style.opacity = 0;
  $$(res,'.preload').style.opacity = 1;
  if (window.innerWidth < 992) {
    pre.scrollIntoView();
  }

  await delay(3000);
  $$(res,'.preload').style.opacity = 0;
  $$(res,'.box').style.opacity = 1;

  if (window.innerWidth < 992) {
    await delay(300);
    pre.style.display = 'none';
  }
};

// Main Program
// -- Input Processing
// -- Start on #start button clicked
$('#start').addEventListener('click', () => {

  (async () => {
    // -- Step 1
    // Init the mainly used objects and values
    const hei = $('#height').value/100,
          wei = $('#weight').value,
          age = $('#age').value;
    let   checkup = false,
          res = 0;

    // -- Step 2.1
    // Check up the submitted input on the queried vars
    // if any field is invalid or left empty => warn user with the red border
    // if not => back to normal
    number.forEach
    (input => (!input.value || input.value < 0) 
    ? input.style.borderColor = 'red' 
    : input.removeAttribute('style'));
    
    if ($('#age').value < valid.age) $('#age').style.borderColor = 'red';
    if ($('#weight').value < valid.weight) $('#weight').style.borderColor = 'red';
    if ($('#height').value < valid.height) $('#height').style.borderColor = 'red';

    radios.forEach((input) => {
      if (input.checked == true) checkup = true;
      
      if (input.checked == false && checkup == false) {
        $_('.gender').forEach(item => {
          item.style.borderColor = 'rgb(246, 4, 4)';
        })
      } 
      else {
        $_('.gender').forEach(item => {
          item.removeAttribute('style');
        })
      }
    });

    // -- Step 2.2
    // Qualify submitted input on the queried input
    // yes => Show the result section, then set 'res' as result which counted as true
    // not => Prevent
    if (age >= valid.age && hei >= (valid.height/100) && wei >= valid.weight && checkup) 
    {
      res = wei/(hei*hei); 
      expandRes(); 
      await delay(1000)
    }
    
    // -- Step 3
    if (res) {
      // -- Step 3.1
      // Init DOM with Query
      // Those DOM elements will be used to store text contents
      // which will be displayed on the result page section
      const sum_head = $('#sum-head'),
            sum_info = $('#sum-info'),
            sum_nums = $('#sum-nums'),
            sum_unit = $('#sum-unit'),
            sum_sums = $('#sum-sums'),
            sum_cats = $('#sum-cats'),
            sum_type = $('#sum-type'),
            sum_avgs = $('#sum-avgs'),
            sum_main = $('#num');

      // -- Step 3.2
      // Converting 'res' value from Centimeter to Meter
      // Creating object that stores limitation of normal and over weight values
      res = Math.floor(res*10)/10; 
      const BMI = {
        n_min: 18.4,
        n_max: 24.9,
        o_min: 29.9,
        o_max: 34.9,
        min: Math.floor(18.4*hei*hei*10)/10,  // Normal min BMI * User Height = min Weight
        max: Math.floor(24.9*hei*hei*10)/10,  // Normal max BMI * User Height = max Weight
      }

      // -- Step 3.3
      // Creating then filling object that stores displayed text contents
      const stat = {
        head: '', 
        info: '', 
        nums: '', 
        unit: '', 
        sums: '', 
        cats: '',
        type: '',
        avgs: '', 
      }
      // Main section of result
      stat.head = 'Hasil BMI Anda:';
      stat.nums = `${res}`;
      stat.unit = 'Kg';

      // Explanation section of result
      // It may has different format for each of result (underweight, normal, overweight ..)
      // It set different color on the number based on it's BMI score
      // It let user get different comment based on it's BMI score
      if (res <= BMI.n_min) {
        stat.info = 'Kekurangan Berat Badan';
        stat.sums = 'Hasil BMI di bawah normal';
        stat.type = 'Anda memiliki berat badan yang <br> kurang dari seharusnya ';
        stat.avgs = BMI.min;
        sum_main.style.color = 'red'
      }
      else if (res > BMI.n_min && res <= BMI.n_max) {
        stat.info = 'Normal';
        stat.sums = 'Hasil BMI Ideal';
        stat.type = 'Pertahankan berat badan <br> Anda di';
        stat.avgs = `${BMI.min} - ${BMI.max}`;
        sum_main.style.color = 'green'
      }
      else if (res > BMI.n_max && res <= BMI.o_min) {
        stat.info = 'Berat Badan Berlebih';
        stat.sums = 'Hasil BMI di atas normal';
        stat.type = 'Berat badan Anda lebih dari berat <br> badan yang seharusnya';
        stat.avgs = BMI.max;
        sum_main.style.color = 'orange'
      }
      else if (res > BMI.o_min && res <= BMI.o_max) {
        stat.info = 'Obesitas';
        stat.sums = 'Hasil BMI jauh di atas normal';
        stat.type = 'Berat badan Anda jauh lebih berat <br> dari yang seharusnya';
        stat.avgs = BMI.max;
        sum_main.style.color = 'red'
      }
      else if (res > BMI.o_max) {
        stat.info = 'Obesitas Tinggi';
        stat.sums = 'Hasil BMI sangat jauh di atas normal';
        stat.type = 'Kami sarankan agar Anda menurunkan <br> berat badan setidaknya hingga';
        stat.avgs = Math.floor(BMI.max*1.2*10)/10;
        sum_main.style.color = 'red'
      }

      // -- Step 3.4
      // Fills up element with defined 'stat' Object
      // It calls $fill() which defined on the top of this .js file
      $fill(sum_head,stat.head);
      $fill(sum_info,stat.info);
      $fill(sum_nums,stat.nums);
      $fill(sum_sums,stat.sums);
      $fill(sum_unit,stat.unit);
      $fill(sum_type,stat.type);
      $fill(sum_cats,stat.cats);
      $fill(sum_avgs,stat.avgs);
    }
  })();
})