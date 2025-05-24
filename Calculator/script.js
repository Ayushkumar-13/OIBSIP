const display = document.getElementById('display');
const buttons = document.querySelectorAll('.button');

let resultDisplayed = false;
let previousAnswer = '';

// Prevent manual keyboard typing but allow cursor movement
display.addEventListener('keydown', (e) => {
  e.preventDefault(); // Prevent typing
});

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const val = button.textContent.trim();

    // CLEAR button
    if (button.dataset.action === 'clear') {
      display.value = '';
      resultDisplayed = false;
      previousAnswer = '';
      return;
    }

    // DELETE button
    if (button.dataset.action === 'delete') {
      if (resultDisplayed) {
        display.value = '';
        resultDisplayed = false;
      } else {
        display.value = display.value.slice(0, -1);
      }
      return;
    }

    // ENTER or "="
    if (val === '=' || button.classList.contains('enter-btn')) {
      try {
        let expr = display.value;

        // Convert symbols to JS-valid expressions
        expr = expr.replace(/x/g, '*')
                   .replace(/÷/g, '/')
                   .replace(/√(\d+(\.\d+)?|\([^()]*\))/g, 'Math.sqrt($1)')
                   .replace(/±/g, '-');

        const evaluated = eval(expr);
        display.value = evaluated;
        previousAnswer = evaluated;
        resultDisplayed = true;
      } catch {
        display.value = 'Error';
        resultDisplayed = true;
      }
      return;
    }

    // ANS
    if (val.toLowerCase() === 'ans') {
      if (previousAnswer !== '') {
        if (resultDisplayed) {
          display.value = previousAnswer;
        } else {
          display.value += previousAnswer;
        }
        resultDisplayed = false;
      }
      return;
    }

    // Supported operators mapping
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

    // Filter out invalid values
    if (!val.match(/^[0-9]$/) && !Object.keys(operatorsMap).includes(val)) {
      return;
    }

    // If a result was just shown and user types a number or ".", start fresh
    if (resultDisplayed && (val.match(/^[0-9]$/) || val === '.')) {
      display.value = val;
    } else {
      const insertVal = operatorsMap[val] ?? val;
      display.value += insertVal;
    }

    resultDisplayed = false;
  });
});
