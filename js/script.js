// TypeLess Init
const $ = (item) => {return document.querySelector(item)};
const $_ = (item) => {return document.querySelectorAll(item)};
const $$ = (cont, item) => {return cont.querySelector(item)};
const delay = (time) => {return new Promise(resolve => setTimeout(resolve, time));}

// Animation to swap Calculator Page View
$('#exp').addEventListener('click', async () => {
  $('#welcome').style.translate = '100vw 0';
  await delay(200);
  $('main').style.translate = '0 calc((100vh - 100px)*-1)';
  $('header').style.boxShadow = '0 0 10px rgba(0,0,0,.2)';

  await delay(800);
  $('main').style.backgroundColor = 'white';
});

$('#start').addEventListener('click', async () => {
  const res = $('#res');
  res.style.translate = '0';

  await delay(3000);
  $$(res,'.preload').style.opacity = 0;
  $$(res,'.box').style.opacity = 1;
})

$('#reset').addEventListener('click', async () => {
  $_('input').forEach((input,i) => {
    input.value = '';
    input.checked = false;
  })
})

$('header').addEventListener('click', () => {
  $('#welcome').removeAttribute('style');
  $('main').removeAttribute('style');
})