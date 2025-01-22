const hovertarget = document.querySelector('.container3');
const clicktarget = document.querySelector('.button');
const countertext = document.querySelector('.counterBox');
const counter = document.querySelector('.counter');
const title = document.querySelector('.title')
const body = document.body;

let clickcount = localStorage.getItem('clickcount')|| 0;

clickcount = Number(clickcount);

counter.textContent = clickcount;

let clickCounter = 0;

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
    
]

clicktarget.addEventListener('click', () => {
    actions[clickCounter]();
    clickCounter = (clickCounter + 1) % actions.length
    
    clickcount ++;
    counter.textContent = clickcount;
    localStorage.setItem('clickcount', clickcount)
})


hovertarget.addEventListener('mouseenter', () => {
    body.style.backgroundColor = '#000000';
})

hovertarget.addEventListener('mouseleave', () => {
    body.style.backgroundColor = 'white';
})

hovertarget.addEventListener('mouseenter', () => {
    countertext.style.color = 'white';
})

hovertarget.addEventListener('mouseleave', () => {
    countertext.style.color = 'black';
})

hovertarget.addEventListener('mouseenter', () => {
    title.style.color = 'white';
})

hovertarget.addEventListener('mouseleave', () => {
    title.style.color = 'black';
})
