
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);

var welcomeScreen = document.querySelector("#welcome")

var welcomeScreenClose = document.querySelector("#welcomeclose")

var welcomeScreenOpen = document.querySelector("#welcomeopen")

document.querySelectorAll(".x").forEach(function(closeBtn) {
  closeBtn.addEventListener("click", function() {
    var windowToClose = closeBtn.closest(".window");
    closeWindow(windowToClose);
  });
});

document.querySelectorAll(".app").forEach(function(openBtn) {
  openBtn.addEventListener("click", function() {
    var targetId = openBtn.getAttribute("data-target");
    var windowToOpen = document.getElementById(targetId);
    openWindow(windowToOpen);
  });
});

function closeWindow(element) {
  element.classList.add("fadeOut");
  element.addEventListener("animationend", function handler() {
    if (selectedIcon) {
      deselectIcon(selectedIcon);
    }
    element.classList.remove("fadeOut");
    element.classList.add("hidden");
    element.removeEventListener("animationend", handler);
  });
}
function openWindow(element) {
  element.classList.remove("hidden");
}
// Make the DIV element draggable:
document.querySelectorAll(".window").forEach(function(win) {
  dragElement(win);
});
// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var selectedIcon = undefined

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element
} 

function deselectIcon(element) {
  element.classList.remove("selected");
  selectedIcon = undefined;
}

function handleIconTap(element) {
  if (element.classList.contains("selected")) {
    deselectIcon(element)
    openWindow(window)
  } else {
    selectIcon(element)
    closeWindow(window)
  }
}
document.querySelectorAll(".app").forEach(function(iconEl) {
  iconEl.addEventListener("click", function() {
    handleIconTap(iconEl);
  });
});

var notesText = document.querySelector("#notes-text");

// Load saved content on page load
var savedNote = localStorage.getItem("myNote");
if (savedNote !== null) {
  notesText.innerHTML = savedNote;
}

// Save content whenever it's edited
notesText.addEventListener("input", function() {
  localStorage.setItem("myNote", notesText.innerHTML);
});

const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = calculator.querySelector('.calculator__output');

keys.addEventListener('click', e=> {
  if (e.target.matches('button')) {
    const key = e.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    const displayedNum = display.textContent;
    const calculator = document.querySelector('.calculator');
    const previousKeyType = calculator.dataset.previousKeyType;
    const calculate = (n1, operator, n2) => {
      let result = '';
      if (operator === 'add') {
        result = parseFloat(n1) + parseFloat(n2);
      } else if (operator === 'subtract') {
        result = parseFloat(n1) - parseFloat(n2);
      } else if (operator === 'multiply') {
        result = parseFloat(n1) * parseFloat(n2);
      } else if (operator === 'divide') {
        result = parseFloat(n1) / parseFloat(n2);
      }
      return result;
    }

    Array.from(key.parentNode.children).forEach(k =>
      k.classList.remove('is-depressed'),
    )
    if (!action) {
      if (displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate') {
        display.textContent = keyContent;
      } else {
        display.textContent = displayedNum + keyContent;
      }
      console.log('num key');
      calculator.dataset.previousKeyType = 'number';
    }
    if (action === 'decimal') {
      if (!displayedNum.includes('.')) {
        display.textContent = displayedNum + ".";
      } else if (previoiusKeyType === 'operator' || previousKeyType === 'calculate') {
        display.textContent = '0.'
      }
        calculator.dataset.previousKeyType = 'decimal';

    }
    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide' 
    ) {

      const firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      const secondValue = displayedNum;

      if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
        const calcValue = calculate(firstValue, operator, secondValue);
        display.textContent = calcValue;
        calculator.dataset.firstValue = calcValue
      } else {
        calculator.dataset.firstValue = displayedNum;
      }


      console.log('operator key');
      key.classList.add('is-depressed');
      calculator.dataset.previousKeyType = 'operator';
      calculator.dataset.operator = action;

    }
    if (action === 'decimal') {
      console.log('decimal key');
    }
    if (action === 'clear') {
      if (key.textContent === 'AC') {
        calculator.dataset.firstValue = '';
        calculator.dataset.modValue = '';
        calculator.dataset.operator = '';
        calculator.dataset.previousKeyType = '';

      } else {
        key.textContent = 'AC';
      }
      display.textContent = 0;
      console.log('clear key');
      calculator.dataset.previousKeyType = 'clear'
    }
    if (action === 'calculate') {
      console.log('equal key');
      let firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      let secondValue = displayedNum;
      
      if (firstValue) {
        if (previousKeyType === 'calculate') {
          firstValue = displayedNum;
          secondValue = calculator.dataset.modValue;
        }
        display.textContent = calculate(firstValue, operator, secondValue);
      }

      calculator.dataset.modValue = secondValue;
      calculator.dataset.previousKeyType = 'calculate';
    }
  }
})