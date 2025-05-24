const display = document.getElementById('display');
const buttons = document.querySelectorAll('.button');

let resultDisplayed = false;
let previousAnswer = '';

// Prevent manual keyboard typing but allow cursor movement with mouse clicks
display.addEventListener('keydown', (e) => {
  e.preventDefault(); // Block typing but allow cursor positioning
});

// Helper to insert text at current cursor position
function insertAtCursor(input, text) {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const val = input.value;

  input.value = val.slice(0, start) + text + val.slice(end);
  input.selectionStart = input.selectionEnd = start + text.length;
  input.focus();
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const val = button.textContent.trim();

    if (button.dataset.action === 'clear') {
      display.value = '';
      resultDisplayed = false;
      previousAnswer = '';
      return;
    }

    if (button.dataset.action === 'delete') {
      if (resultDisplayed) {
        display.value = '';
        resultDisplayed = false;
      } else {
        // Delete character before cursor
        const start = display.selectionStart;
        const end = display.selectionEnd;

        if (start === end && start > 0) {
          display.value = display.value.slice(0, start - 1) + display.value.slice(end);
          display.selectionStart = display.selectionEnd = start - 1;
        } else if (start !== end) {
          display.value = display.value.slice(0, start) + display.value.slice(end);
          display.selectionStart = display.selectionEnd = start;
        }
      }
      display.focus();
      return;
    }

    // Operators and valid characters
    const operatorsMap = {
      'x': '*',
      '÷': '/',
      '%': '%',
      '+': '+',
      '-': '-',
      '.': '.',
      '(': '(',
      ')': ')',
      '√': '√',
      '±': '±',
    };

    if (val === '=' || button.classList.contains('enter-btn')) {
      try {
        let expr = display.value;

        // Replace 'x', '÷', '√', '±' with JS expressions
        expr = expr.replace(/x/g, '*').replace(/÷/g, '/');

        // Replace all '√' with Math.sqrt calls: for simplicity, we convert √number to sqrt(number)
        // This requires some parsing; we will replace √number or √(expr) with Math.sqrt(...)
        expr = expr.replace(/√(\d+(\.\d+)?|\([^()]*\))/g, 'Math.sqrt($1)');

        // Handle ±: toggle sign of last number — for simplicity, let's just ignore or treat as minus
        expr = expr.replace(/±/g, '-');

        const evaluated = eval(expr);
        display.value = evaluated;
        previousAnswer = evaluated;
        resultDisplayed = true;
      } catch {
        display.value = 'Error';
        resultDisplayed = true;
      }
      display.focus();
      return;
    }

    if (val.toLowerCase() === 'ans') {
      if (previousAnswer !== '') {
        if (resultDisplayed) {
          display.value = previousAnswer;
          display.selectionStart = display.selectionEnd = display.value.length;
        } else {
          insertAtCursor(display, previousAnswer);
        }
        resultDisplayed = false;
      }
      return;
    }

    
    if (!val.match(/^[0-9]$/) && !Object.keys(operatorsMap).includes(val)) {
      return;
    }

    if (resultDisplayed && (val.match(/^[0-9]$/) || val === '.')) {
      display.value = val;
      resultDisplayed = false;
      display.selectionStart = display.selectionEnd = display.value.length;
    } else {
      // Insert operator or number at cursor
      let insertVal = operatorsMap[val] ?? val; // Map to JS operator or raw val
      insertAtCursor(display, insertVal);
      resultDisplayed = false;
    }
  });
});
