// TypeLess Init
const $ = (item) => {return document.querySelector(item)};
const $_ = (item) => {return document.querySelectorAll(item)};
const $$ = (cont, item) => {return cont.querySelector(item)};
const $$_ = (cont, item) => {return cont.querySelectorAll(item)};
const delay = (time) => {return new Promise(resolve => setTimeout(resolve, time));}
const $fill = (item, text) => {item.innerHTML = text;}
const valid = {
  age: 18,
  weight: 10,
  height: 50,
}

// Animation for swap -- Welcome => Calculator Page View
$('#exp').addEventListener('click', async () => {
  $('#welcome').style.translate = '100vw 0';
  await delay(200);
  $('main').style.translate = '0 calc((100vh - 100px)*-1)';
  $('header').style.boxShadow = '0 0 10px rgba(0,0,0,.2)';

  await delay(800);
  $('main').style.backgroundColor = 'white';
});

// Animation for swap -- Calculator Page View => Welcome
$('header').addEventListener('click', () => {
  $('#welcome').removeAttribute('style');
  $('header').removeAttribute('style');
  $('main').removeAttribute('style');
})

// Reset input field
$('#reset').addEventListener('click', async () => {
  $_('input').forEach((input) => {
    input.value = '';       // Reset input[number]
    input.checked = false;  // Reset input[radio]
  })
})

// Recolor on input fills
const radios = $_('.radio');
radios.forEach(radio => {
  radio.addEventListener('click', () => {
    $_('.gender').forEach(item => {item.style.borderColor= 'transparent'})
  })
})
const number = $_('.number');
number.forEach((input,i) => {
  input.addEventListener('input', () => {
    input.removeAttribute('style');
    if (!input.value) input.style.borderColor = 'red';
    if (i == 0 && input.value < valid.age) input.style.borderColor = 'red';
    if (i == 1 && input.value < valid.weight) input.style.borderColor = 'red';
    if (i == 2 && input.value < valid.height) input.style.borderColor = 'red';
  })
})

// Slide-in Animation Init
const expandRes = async () => {
  const res = $('#res');
  res.style.translate = '0';
  $$(res,'.box').style.opacity = 0;
  $$(res,'.preload').style.opacity = 1;

  await delay(3000);
  $$(res,'.preload').style.opacity = 0;
  $$(res,'.box').style.opacity = 1;
};

// Calculating Process
$('#start').addEventListener('click', () => {
  let checkup = false;

  (async () => {
    /////
    // Init
    const hei = $('#height').value/100,
          wei = $('#weight').value,
          age = $('#age').value;
    let   res = 0;
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

    /////
    // if field left empty / invalid => warn user
    number.forEach(input => (!input.value || input.value < 0) ? input.style.borderColor = 'red' : input.removeAttribute('style'));
    if ($('#age').value < valid.age) $('#age').style.borderColor = 'red';
    if ($('#weight').value < valid.weight) $('#weight').style.borderColor = 'red';
    if ($('#height').value < valid.height) $('#height').style.borderColor = 'red';
    radios.forEach((input) => {
      if (input.checked == true) checkup = true;
      
      if (input.checked == false && checkup == false) {
        $_('.gender').forEach(item => {
          item.style.borderColor = 'rgb(246, 4, 4)';
        })
      } else {
        $_('.gender').forEach(item => {
          item.removeAttribute('style');
        })
      }
    });

    /////
    // Qualify age, if true => Calculate
    if (age >= valid.age && hei < valid.height && wei < valid.weight && checkup) {res = wei/(hei*hei); expandRes(); await delay(1000)}
    else res = 0;

    /////
    // Init DOM
    const sum_head = $('#sum-head'),
          sum_info = $('#sum-info'),
          sum_nums = $('#sum-nums'),
          sum_unit = $('#sum-unit'),
          sum_sums = $('#sum-sums'),
          sum_cats = $('#sum-cats'),
          sum_type = $('#sum-type'),
          sum_avgs = $('#sum-avgs')
    
    /////
    // Start Calculation
    if (res) {
      res = Math.floor(res*10)/10;  // Minimzed behind commas
      const BMI = {
        n_min: 18.4,
        n_max: 24.9,
        o_min: 29.9,
        o_max: 34.9,
        min: Math.floor(18.4*hei*hei*10)/10,  // Normal min BMI * Height = min Weight
        max: Math.floor(24.9*hei*hei*10)/10,  // Normal max BMI * Height = max Weight
      }

      ///////
      // Fills up object
      stat.head = 'Hasil BMI Anda:';
      stat.nums = `${res}`;
      stat.unit = 'Kg';

      if (res <= BMI.n_min) {
        stat.info = 'Kekurangan Berat Badan';
        stat.type = 'Anda memiliki berat badan yang <br> kurang dari seharusnya ';
        stat.sums = 'Hasil BMI di bawah normal';
        stat.avgs = BMI.min;
      }
      else if (res > BMI.n_min && res <= BMI.n_max) {
        stat.info = 'Normal';
        stat.type = 'Pertahankan berat badan <br> Anda di';
        stat.sums = 'Hasil BMI Ideal';
        stat.avgs = `${BMI.min} - ${BMI.max}`;
      }
      else if (res > BMI.n_max && res <= BMI.o_min) {
        stat.info = 'Berat Badan Berlebih';
        stat.type = 'Berat badan Anda lebih dari berat <br> badan yang seharusnya';
        stat.sums = 'Hasil BMI di atas normal';
        stat.avgs = BMI.max;
      }
      else if (res > BMI.o_min && res <= BMI.o_max) {
        stat.info = 'Obesitas';
        stat.type = 'Berat badan Anda jauh lebih berat <br> dari yang seharusnya';
        stat.sums = 'Hasil BMI jauh di atas normal';
        stat.avgs = BMI.max;
      }
      else if (res > BMI.o_max) {
        stat.info = 'Obesitas Tinggi';
        stat.type = 'Kami sarankan agar Anda menurunkan <br> berat badan setidaknya hingga';
        stat.sums = 'Hasil BMI sangat jauh di atas normal';
        stat.avgs = Math.floor(BMI.max*1.2*10)/10;
      }

      ///////
      // Fills up element
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