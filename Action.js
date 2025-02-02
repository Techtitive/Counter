const hovertarget = document.querySelector('.container3');
const clicktarget = document.querySelector('.button');
const countertext = document.querySelector('.counterBox');
const counter = document.querySelector('.counter');
const title = document.querySelector('.title');
const viewers = document.querySelector('#active-users');
const help = document.querySelector('#help');
const cbox = document.querySelector('#containerbox');
const clr1 = document.querySelector('.clr1');
const clr2 = document.querySelector('.clr2');
const clr3 = document.querySelector('.clr3');
const footer = document.querySelector('.footertext');
const body = document.body;

let clickcount = localStorage.getItem('clickcount')|| 0;

clickcount = Number(clickcount);

counter.textContent = clickcount;

let clickCounter = 0;

let isKeyPressed = false;

// Keyboard event listener (modified)
document.addEventListener('keydown', (event) => {
  if ((event.key === '=' || event.key === 'ArrowUp' || event.key === ' ') && !isKeyPressed) {
    event.preventDefault();
    isKeyPressed = true; // Mark key as pressed

    clicktarget.click(); // Trigger increment
    clr1.style.display = 'none';
    clr2.style.display = 'none';
    clr3.style.display = 'none';
  }
});

// Reset the flag when key is released
document.addEventListener('keyup', (event) => {
  if (event.key === '=' || event.key === 'ArrowUp' || event.key === ' ') {
    isKeyPressed = false;
  }
});


const actions = [
    () => (body.style.backgroundColor = '#A1C4FD'),
    () => (body.style.backgroundColor = 'blue'),
    () => (body.style.backgroundColor = '#FFFB7D'),
    () => (body.style.backgroundColor = 'yellow'),
    () => (body.style.backgroundColor = '#F8BBD0'),
    () => (body.style.backgroundColor = 'red'),
    () => (body.style.backgroundColor = '#B2EBF2'),
    () => (body.style.backgroundColor = 'green'),
    () => (body.style.backgroundColor = '#FFEE58'),
    () => (body.style.backgroundColor = 'orange'),
    () => (body.style.backgroundColor = '#A0C4FF'),
    () => (body.style.backgroundColor = 'brown'),
    () => (body.style.backgroundColor = '#C8E6C9'),
    () => (body.style.backgroundColor = 'grey'),
    () => (body.style.backgroundColor = '#D1C4E9'),
    () => (body.style.backgroundColor = 'teal'),
    () => (body.style.backgroundColor = '#FFB3DE'),
    () => (body.style.backgroundColor = 'chocolate'),
    () => (body.style.backgroundColor = '#D4E157'),
    () => (body.style.backgroundColor = 'pink'),
    () => (body.style.backgroundColor = '#F0E68C'),
    () => (body.style.backgroundColor = 'purple'),
    () => (body.style.backgroundColor = '#FFDAC1'),
    () => (body.style.backgroundColor = 'cyan'),
    () => (body.style.backgroundColor = '#D3F8E2'),
    () => (body.style.backgroundColor = '#F3E5F5'),
    () => (body.style.backgroundColor = '#A1C4FD'),
    
];

clicktarget.addEventListener('click', () => {
    actions[clickCounter]();
    clickCounter = (clickCounter + 1) % actions.length;
    
    clickcount ++;
    counter.textContent = clickcount;
    localStorage.setItem('clickcount', clickcount);
});


hovertarget.addEventListener('mouseenter', () => {
    body.style.backgroundColor = '#000000';
    clr1.style.display = 'block';
    clr2.style.display = 'block';
    clr3.style.display = 'block';
});

hovertarget.addEventListener('mouseleave', () => {
    body.style.backgroundColor = 'white';
});

hovertarget.addEventListener('mouseenter', () => {
    countertext.style.color = 'white';
});

hovertarget.addEventListener('mouseleave', () => {
    countertext.style.color = 'black';
});

hovertarget.addEventListener('mouseenter', () => {
    title.style.color = 'white';
});

hovertarget.addEventListener('mouseleave', () => {
    title.style.color = 'black';
});

hovertarget.addEventListener('mouseenter', () => {
    footer.style.color = 'white';
});

hovertarget.addEventListener('mouseleave', () => {
    footer.style.color = 'black';
});

hovertarget.addEventListener('mouseenter', () => {
    viewers.style.backgroundColor = 'white';
});

hovertarget.addEventListener('mouseleave', () => {
    viewers.style.backgroundColor = 'black';
});

hovertarget.addEventListener('mouseenter', () => {
    viewers.style.color = 'black';
});

hovertarget.addEventListener('mouseleave', () => {
    viewers.style.color = 'white';
});
hovertarget.addEventListener('mouseenter', () => {
    help.style.backgroundColor = 'white';
});

hovertarget.addEventListener('mouseleave', () => {
    help.style.backgroundColor = 'black';
});

hovertarget.addEventListener('mouseenter', () => {
    help.style.color = 'black';
});

hovertarget.addEventListener('mouseleave', () => {
    help.style.color = 'white';
});

let clicks = 0;

help.addEventListener('click', () => {
    clicks++;
    if (clicks%2 == 1){
        cbox.style.visibility = 'visible';
        cbox.style.zIndex = '999';
        hovertarget.style.visibility = 'hidden';
        help.style.color = 'red';
    }

    else if (clicks%2 == 0){
        cbox.style.visibility = 'hidden';
        cbox.style.zIndex = '-1';
        hovertarget.style.visibility = 'visible';
        help.style.color = 'white';
    }
});

cbox.addEventListener('mouseenter', () => {
    body.style.backgroundColor = 'black';
});
cbox.addEventListener('mouseleave', () => {
    body.style.backgroundColor = 'white';
});

document.addEventListener('keydown', (event) => {
    if(event.key === 'Escape'){
        cbox.style.visibility = 'hidden';
        cbox.style.zIndex = '-1';
        hovertarget.style.visibility = 'visible';
        help.style.color = 'white';
    }
});

document.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        cbox.style.visibility = 'hidden';
        cbox.style.zIndex = '-1';
        hovertarget.style.visibility = 'visible';
        help.style.color = 'white';
    }
});

document.addEventListener('keydown', (event) => {
    if(event.key === 'ArrowLeft' || event.key === 'ArrowRight'){
        actions[clickCounter]();
        clickCounter = (clickCounter + 1) % actions.length;
    }
});
