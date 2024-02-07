document.addEventListener('DOMContentLoaded', function () {
    displayExpenses();
});

function addExpense() {
    const expenseAmount = document.getElementById('expenseAmount').value;

    if (expenseAmount.trim() === '') {
        alert('Please enter a valid expense amount.');
        return;
    }

    fetch('/api/addExpense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseFloat(expenseAmount) }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayExpenses();
        })
        .catch(error => console.error('Error:', error));
}

function displayExpenses() {
    fetch('/api/getExpenses')
        .then(response => response.json())
        .then(data => {
            const expenseListContainer = document.getElementById('expenseList');

            expenseListContainer.innerHTML = '<h2>Expense History</h2>';

            if (data.length === 0) {
                expenseListContainer.innerHTML += '<p>No expenses recorded yet.</p>';
            } else {
                data.forEach(expense => {
                    expenseListContainer.innerHTML += `<p>Amount: $${expense.amount.toFixed(2)} - Date: ${expense.date}</p>`;
                });
            }
        })
        .catch(error => console.error('Error:', error));
}
