// filepath: /calculator-project/calculator-project/src/scripts/calculator.js
const outputField = document.forms.output;
const historyList = document.getElementById('history-list');

document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (!isNaN(key) || ['+', '-', '*', '/', '.'].includes(key)) {
        outputField.value += key;
    } else if (key === 'Enter') {
        calculateResult();
    } else if (key === 'Backspace') {
        outputField.value = outputField.value.slice(0, -1);
    }
});

function calculateResult() {
    try {
        const expression = outputField.value;
        const result = eval(expression);
        if (result !== undefined) {
            addToHistory(expression, result);
            outputField.value = result;
        }
    } catch (error) {
        alert("잘못된 수식입니다.");
    }
}

function addToHistory(expression, result) {
    const historyItem = document.createElement('li');
    historyItem.innerHTML = `${expression} = ${result} <button onclick="deleteHistoryItem(this)">X</button>`;
    historyList.prepend(historyItem);
}

function deleteHistoryItem(button) {
    button.parentElement.remove();
}

function toggleHistory() {
    const historySection = document.querySelector('.history');
    historySection.classList.toggle('hidden');
}

function clearHistory() {
    historyList.innerHTML = '';
}