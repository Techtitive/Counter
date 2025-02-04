// === ELEMENT SELECTION ===
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

// === INITIALIZE COUNTER ===
let clickcount = Number(localStorage.getItem('clickcount')) || 0;
counter.textContent = clickcount;
let clickCounter = 0;

// === KEYBOARD HELPER FLAG ===
let isKeyPressed = false;

// === HOVER STATE FLAGS ===
let isHoveringHovertarget = false;
let isHoveringCbox = false;
// Remove accidental assignment here – we will update these in the proper events

// === HELPER FUNCTION TO UPDATE BACKGROUND ===
function updateBackground() {
  // If either element is hovered, force black background.
  if (isHoveringHovertarget || isHoveringCbox) {
    body.style.backgroundColor = '#000000';
  } else {
    body.style.backgroundColor = 'white';
  }
}

// === KEYBOARD EVENT LISTENERS FOR BUTTON INCREMENTS ===
document.addEventListener('keydown', (event) => {
  // '=' , ArrowUp, or space triggers the clicktarget:
  if ((event.key === '=' || event.key === 'ArrowUp' || event.key === ' ') && !isKeyPressed) {
    event.preventDefault(); // Prevent default (e.g. space scrolling/activating focused button)
    isKeyPressed = true;
    clicktarget.click(); // Simulate a click on the main button
    // Hide color elements
    clr1.style.display = 'none';
    clr2.style.display = 'none';
    clr3.style.display = 'none';
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === '=' || event.key === 'ArrowUp' || event.key === ' ') {
    isKeyPressed = false;
  }
});

// === ARRAY OF ACTIONS FOR BACKGROUND COLOR CHANGES ===
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

// === CLICK EVENT ON THE MAIN BUTTON ===
clicktarget.addEventListener('click', () => {
  actions[clickCounter]();
  clickCounter = (clickCounter + 1) % actions.length;
  
  clickcount++;
  counter.textContent = clickcount;
  localStorage.setItem('clickcount', clickcount);
});

// === HOVERTARGET (MAIN CONTAINER) EVENTS ===
hovertarget.addEventListener('mouseenter', () => {
  isHoveringHovertarget = true;
  updateBackground();
  // Apply hover styles:
  countertext.style.color = 'white';
  title.style.color = 'white';
  footer.style.color = 'white';
  viewers.style.backgroundColor = 'white';
  viewers.style.color = 'black';
  help.style.backgroundColor = 'white';
  // When hovering the main container, if the help menu is closed then help text should be black.
  if (cbox.style.visibility !== 'visible') {
    help.style.color = 'black';
  }
  
  clr1.style.display = 'block';
  clr2.style.display = 'block';
  clr3.style.display = 'block';
});
hovertarget.addEventListener('mouseleave', () => {
  isHoveringHovertarget = false;
  updateBackground();
  // Revert hover styles:
  countertext.style.color = 'black';
  title.style.color = 'black';
  footer.style.color = 'black';
  viewers.style.backgroundColor = 'black';
  viewers.style.color = 'white';
  help.style.backgroundColor = 'black';
  // When not hovering, if the help menu is closed then help text becomes white.
  if (cbox.style.visibility !== 'visible') {
    help.style.color = 'white';
  }
  
  clr1.style.display = 'block';
  clr2.style.display = 'block';
  clr3.style.display = 'block';
});

// === CBOX EVENTS ===
// When the help box is hovered, we want to simulate that hovertarget is also hovered.
cbox.addEventListener('mouseenter', () => {
  isHoveringCbox = true;
  isHoveringHovertarget = true; // Simulate hovertarget hover when cbox is hovered.
  
  // Apply similar hover styling:
  countertext.style.color = 'white';
  title.style.color = 'white';
  footer.style.color = 'white';
  viewers.style.backgroundColor = 'white';
  viewers.style.color = 'black';
  help.style.backgroundColor = 'white';
  // Keep help text red while cbox is open/hovered.
  help.style.color = 'red';
  
  updateBackground();
});

cbox.addEventListener('mouseleave', () => {
  isHoveringCbox = false;
  // When leaving cbox, check if hovertarget is still hovered.
  // (Since hovertarget is hidden while cbox is visible, we use the :hover pseudoclass.)
  if (!hovertarget.matches(':hover')) {
    isHoveringHovertarget = false;
  }
  
  countertext.style.color = 'black';
  title.style.color = 'black';
  footer.style.color = 'black';
  viewers.style.backgroundColor = 'black';
  viewers.style.color = 'white';
  
  // Set help text color based on whether hovertarget is hovered.
  help.style.color = isHoveringHovertarget ? 'black' : 'white';
  
  updateBackground();
});

// === HELP MENU TOGGLE ===
let clicks = 0;
help.addEventListener('click', () => {
  clicks++;
  if (clicks % 2 === 1) {
    // Open help menu: show cbox and hide hovertarget.
    cbox.style.visibility = 'visible';
    cbox.style.zIndex = '999';
    hovertarget.style.visibility = 'hidden';
    // Set help text to red when opened.
    help.style.color = 'red';
  } else {
    // Close help menu: hide cbox and show hovertarget.
    cbox.style.visibility = 'hidden';
    cbox.style.zIndex = '-1';
    hovertarget.style.visibility = 'visible';
    // On closing, if hovertarget (or cbox) was hovered, set help text to black; otherwise, white.
    help.style.color = isHoveringHovertarget ? 'black' : 'white';
  }
});


// === DOCUMENT KEYDOWN: CLOSE HELP MENU (ESC & ENTER) ===
let keynum = 0;
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    keynum++;
    if(keynum%2 === 1) {
    cbox.style.visibility = 'visible';
    cbox.style.zIndex = '999';
    hovertarget.style.visibility = 'hidden';
    // When closing via key shortcut, set help text based on hover state.
    help.style.color = 'red';
    
    // Hide the color elements (if needed)
    clr1.style.display = 'none';
    clr2.style.display = 'none';
    clr3.style.display = 'none';
    
    // Reapply hovertarget hover styles if currently hovered.
     if (isHoveringHovertarget) {
      countertext.style.color = 'white';
      title.style.color = 'white';
      footer.style.color = 'white';
      viewers.style.backgroundColor = 'white';
      viewers.style.color = 'black';
      help.style.backgroundColor = 'white';
     }
    }

    else if(keynum%2 === 0) {
      cbox.style.visibility = 'hidden';
      cbox.style.zIndex = '-1';
      hovertarget.style.visibility = 'visible';
      // When closing via key shortcut, set help text based on hover state.
      help.style.color = isHoveringHovertarget ? 'black' : 'white';
      
      // Hide the color elements (if needed)
      clr1.style.display = 'block';
      clr2.style.display = 'block';
      clr3.style.display = 'block';
    }
  }
});

// === DOCUMENT KEYDOWN: ARROW LEFT/RIGHT FOR ACTIONS ===
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    actions[clickCounter]();
    clickCounter = (clickCounter + 1) % actions.length;
  }
});
