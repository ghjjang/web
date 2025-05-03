// filepath: /calculator-project/calculator-project/src/scripts/history.js

const historyList = document.getElementById('history-list');

function addToHistory(expression, result) {
    const historyItem = document.createElement('li');
    historyItem.innerHTML = `${expression} = ${result} <button onclick="deleteHistoryItem(this)">X</button>`;
    historyList.prepend(historyItem);
}

function deleteHistoryItem(button) {
    button.parentElement.remove();
}

function toggleHistory() {
    historyList.classList.toggle('hidden');
}

function clearHistory() {
    historyList.innerHTML = '';
}