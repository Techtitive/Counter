// === ELEMENT SELECTION ===
const hovertarget = document.querySelector('.clrcon');
const clicktarget = document.querySelector('.button');
const countertext = document.querySelector('.counterBox');
const counter = document.querySelector('.counter');
const title = document.querySelector('.title');
const viewers = document.querySelector('#active-users');
const help = document.querySelector('#help');
const sign = document.querySelector('#signin');
const cbox = document.querySelector('#conbox');
const sbox = document.querySelector('.auth-container');
const clri = document.querySelector('.clrcon i');
const clr1 = document.querySelector('.clr1');
const clr2 = document.querySelector('.clr2');
const clr3 = document.querySelector('.clr3');
const footer = document.querySelector('.footertext');
const all = document.querySelectorAll('*');
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

let cboxon = false;
let sboxon = false;
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
  sign.style.backgroundColor = 'white';
  sign.style.color = 'black';
  clr1.style.visibility = 'visible';
  clr2.style.visibility = 'visible';
  clr3.style.visibility = 'visible';

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
  sign.style.backgroundColor = 'black';
  sign.style.color = 'white';

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
  sign.style.backgroundColor = 'white';
  sign.style.color = 'black';
  
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
  help.style.backgroundColor = 'black';
  sign.style.backgroundColor = 'black';
  sign.style.color = 'white';
  if (cbox.style.visibility == 'visible') {
    // If cbox is still visible, keep help text red.
    help.style.color = 'red';
  }

  
  updateBackground();
});

// === SBOX EVENTS ===
// When the help box is hovered, we want to simulate that hovertarget is also hovered.
sbox.addEventListener('mouseenter', () => {
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
  sign.style.backgroundColor = 'white';
  sign.style.color = 'black';
  
  updateBackground();
});

sbox.addEventListener('mouseleave', () => {
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
  help.style.backgroundColor = 'black';
  sign.style.backgroundColor = 'black';
  sign.style.color = 'white';
  if (cbox.style.visibility == 'visible') {
    // If cbox is still visible, keep help text red.
    help.style.color = 'red';
  }

  
  updateBackground();
});

// === HELP MENU TOGGLE ON CLICK ===
let clicks = 0;
help.addEventListener('click', () => {
  clicks++;
  if (clicks % 2 === 1) {
    // Open help menu:
    cbox.style.visibility = 'visible';
    cbox.style.zIndex = '1999';
    // Hide the sign in menu if it is visible:
    sbox.style.visibility = 'hidden';
    // Hide the main container:
    hovertarget.style.visibility = 'hidden';
    help.style.color = 'red';
    if (cbox.style.visibility == 'visible') {
      clr1.style.visibility = 'hidden';
      clr2.style.visibility = 'hidden';
      clr3.style.visibility = 'hidden';
    }
  } else {
    // Close help menu:
    cbox.style.visibility = 'hidden';
    // Show the main container:
    hovertarget.style.visibility = 'visible';
    // Set help text color based on hover state:
    help.style.color = isHoveringHovertarget ? 'black' : 'white';
    clr1.style.visibility = 'visible';
    clr2.style.visibility = 'visible';
    clr3.style.visibility = 'visible';
  }
});

// === DOCUMENT KEYDOWN: TOGGLE HELP MENU (ENTER KEY) ===
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    clicks++;
    if (clicks % 2 === 1) {
      // Open help menu:
      cbox.style.visibility = 'visible';
      cbox.style.zIndex = '1999';
      // Also ensure sign in menu is hidden:
      sbox.style.visibility = 'hidden';
      hovertarget.style.visibility = 'hidden';
      help.style.color = 'red';
      // Hide color elements if needed:
      clri.style.transition = '0s';            // Set transition duration to 0
      clri.style.transitionDelay = '0s';       // Set transition delay to 0
      
      clr1.style.visibility = 'hidden';
      clr2.style.visibility = 'hidden';
      clr3.style.visibility = 'hidden';
      
      // (Reapply hover styles if desired)
      if (isHoveringHovertarget) {
        countertext.style.color = 'white';
        title.style.color = 'white';
        footer.style.color = 'white';
        viewers.style.backgroundColor = 'white';
        viewers.style.color = 'black';
        help.style.backgroundColor = 'white';
        clr1.style.visibility = 'hidden';
        clr2.style.visibility = 'hidden';
        clr3.style.visibility = 'hidden';

      }
    } else if (clicks % 2 === 0) {
      // Close help menu:
      cbox.style.visibility = 'hidden';
      hovertarget.style.visibility = 'visible';
      help.style.color = isHoveringHovertarget ? 'black' : 'white';
      // Show color elements if needed:
      clr1.style.visibility = 'visible';
      clr2.style.visibility = 'visible';
      clr3.style.visibility = 'visible';
    }
  }
});


let slicks = 0;
sign.addEventListener('click', () => {
  slicks++;
  if (slicks % 2 === 1) {
    // Open help menu:
    sbox.style.visibility = 'visible';
    sbox.style.zIndex = '1999';
    // Hide the sign in menu if it is visible:
    cbox.style.visibility = 'hidden';
    // Hide the main container:
    hovertarget.style.visibility = 'hidden';
    sign.style.color = 'red';
    if (cbox.style.visibility == 'visible') {
      clr1.style.visibility = 'hidden';
      clr2.style.visibility = 'hidden';
      clr3.style.visibility = 'hidden';
    }
  } else {
    // Close help menu:
    sbox.style.visibility = 'hidden';
    // Show the main container:
    hovertarget.style.visibility = 'visible';
    // Set help text color based on hover state:
    sign.style.color = isHoveringHovertarget ? 'black' : 'white';
    clr1.style.visibility = 'visible';
    clr2.style.visibility = 'visible';
    clr3.style.visibility = 'visible';
  }
});


// === DOCUMENT KEYDOWN: CLOSE HELP MENU (ESC & ENTER) ===
const email = document.getElementById('email');
const input2 = document.getElementById('password');

let inputHovered = false; // Flag to track if either input is hovered

// Update the flag when email is hovered
email.addEventListener('mouseenter', () => { inputHovered = true; });
email.addEventListener('mouseleave', () => { inputHovered = false; });

// Update the flag when input2 is hovered
input2.addEventListener('mouseenter', () => { inputHovered = true; });
input2.addEventListener('mouseleave', () => { inputHovered = false; });

// Listen for keydown events on the document
document.addEventListener('keydown', (event) => {
  if (event.key === 'Shift') {
    // Ignore Shift if either input is hovered or is focused (i.e. you're typing in it)
    if (inputHovered || event.target === email || event.target === input2) {
      return;
    }
    
    slicks++;
    
    if (slicks % 2 === 1) {
      sbox.style.visibility = 'visible';
      sbox.style.zIndex = '1999';
      hovertarget.style.visibility = 'hidden';
      sign.style.color = 'red';
      
      // Hide the color elements
      clr1.style.visibility = 'hidden';
      clr2.style.visibility = 'hidden';
      clr3.style.visibility = 'hidden';
      
      // Reapply hovertarget hover styles if currently hovered.
      if (isHoveringHovertarget) {
        countertext.style.color = 'white';
        title.style.color = 'white';
        footer.style.color = 'white';
        viewers.style.backgroundColor = 'white';
        viewers.style.color = 'black';
        sign.style.backgroundColor = 'white';
      }
    } else {
      sbox.style.visibility = 'hidden';
      hovertarget.style.visibility = 'visible';
      sign.style.color = isHoveringHovertarget ? 'black' : 'white';
      
      // Show the color elements
      clr1.style.visibility = 'visible';
      clr2.style.visibility = 'visible';
      clr3.style.visibility = 'visible';
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


    document.addEventListener("DOMContentLoaded", function () {
        const passwordInput = document.getElementById("password");
        const togglePassword = document.getElementById("toggle-password");
        const show = document.querySelector(".show");
        const hide = document.querySelector(".hide");
        let iconclick = 1;
        passwordInput.addEventListener("input", function () {
            togglePassword.style.display = this.value ? "inline" : "none";
        });
        if (passwordInput.textContent.length !== 0) {
            togglePassword.style.display = "inline";
        }
        togglePassword.addEventListener("click", function () {
          iconclick++;
            if (iconclick % 2 === 0) {
                hide.style.display = "none";
                show.style.display = "block";
                passwordInput.type = "text";
            }
            else if (iconclick % 2 === 1) {
                hide.style.display = "block";
                show.style.display = "none";
                passwordInput.type = "password";
                
            }

        });
    });

    let out = 0;
    const outlineBtn = document.querySelector('.outline'); // The button element
    // Select all elements on the page
    const allElements = document.querySelectorAll('*');
    
    outlineBtn.addEventListener("click", () => {
      out++;
      if (out % 2 === 1) {
        // Apply red outline to each element
        allElements.forEach(el => {
          el.style.outline = "1px solid red";
        });
      } else {
        // Remove the outline by clearing the inline style
        allElements.forEach(el => {
          el.style.outline = "";
        });
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.ctrlKey && (event.key === 'c' || event.key === 'C')) {
        out++;
        if (out%2 === 1){
          allElements.forEach(el => {
            el.style.outline = "1px solid red";
          });
        } else {
          // Remove the outline by clearing the inline style
          allElements.forEach(el => {
            el.style.outline = "";
          });
        }
      }
    }
    )
