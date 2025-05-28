let currentExpression = '';
let lastResult = '0';

function handleButtonClick(value) {
  const expressionElement = document.getElementById('expression');
  const resultElement = document.getElementById('result');
  const errorElement = document.getElementById('error-message');

  errorElement.textContent = ''; // Clear previous error

  if (value === 'C') {
    currentExpression = '';
    lastResult = '0';
    expressionElement.textContent = '';
    resultElement.textContent = '0';
    return;
  }

  if (value === 'DEL') {
    currentExpression = currentExpression.slice(0, -1);
    expressionElement.textContent = currentExpression;
    try {
      if (currentExpression) {
        const result = eval(currentExpression.replace('÷', '/').replace('×', '*'));
        resultElement.textContent = isFinite(result) ? result : '0';
      } else {
        resultElement.textContent = '0';
      }
    } catch {
      resultElement.textContent = lastResult;
    }
    return;
  }

  if (value === '=') {
    try {
      const result = eval(currentExpression.replace('÷', '/').replace('×', '*'));
      if (!isFinite(result)) {
        errorElement.textContent = '錯誤：除以零';
        return;
      }
      lastResult = result.toString();
      currentExpression = lastResult;
      expressionElement.textContent = currentExpression;
      resultElement.textContent = lastResult;
    } catch {
      errorElement.textContent = '錯誤：無效運算式';
    }
    return;
  }

  // Prevent multiple operators in a row (simple validation)
  const lastChar = currentExpression.slice(-1);
  const operators = ['+', '-', '*', '/', '%'];
  if (operators.includes(value) && operators.includes(lastChar)) {
    currentExpression = currentExpression.slice(0, -1) + value;
  } else {
    currentExpression += value;
  }

  expressionElement.textContent = currentExpression;

  // Try to evaluate the expression in real-time
  try {
    const result = eval(currentExpression.replace('÷', '/').replace('×', '*'));
    if (isFinite(result)) {
      resultElement.textContent = result;
      lastResult = result.toString();
    } else {
      resultElement.textContent = lastResult;
      errorElement.textContent = '錯誤：除以零';
    }
  } catch {
    resultElement.textContent = lastResult;
  }
}

function toggleMenu() {
  const settingsPanel = document.getElementById('settings-panel');
  settingsPanel.classList.toggle('open');
}