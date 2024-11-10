let expenses = []; // Array to store expenses

function addExpense() {
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const name = document.getElementById("name").value;
    const date = document.getElementById("date").value;

    if (amount && category && name && date) {
        expenses.push({
            amount: parseFloat(amount),
            category,
            name,
            date: new Date(date)
        });
        displayExpenses();
        updateDashboard(); // Update dashboard chart
        clearForm();
    }
}

function clearForm() {
    document.getElementById("amount").value = '';
    document.getElementById("category").value = '';
    document.getElementById("name").value = '';
    document.getElementById("date").value = '';
}

// Function to display expenses in list form
function displayExpenses(month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
    const list = document.getElementById("expenseList");
    list.innerHTML = '';
    const filteredExpenses = expenses.filter(expense => expense.date.getMonth() + 1 === month && expense.date.getFullYear() === year);

    filteredExpenses.forEach((expense, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${expense.date.toDateString()} - ${expense.category}: $${expense.amount} 
                        <button onclick="deleteExpense(${index})">Delete</button>`;
        list.appendChild(li);
    });
}

// Initial chart setup with zero data for each month
const initialData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
        label: 'Monthly Expenses',
        data: Array(12).fill(0), // Start with zero expenses
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true
    }]
};

const config = {
    type: 'line',
    data: initialData,
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

// Initialize the dashboard chart on page load
window.onload = function() {
    const ctx = document.getElementById('dashboardChart').getContext('2d');
    window.dashboardChart = new Chart(ctx, config);
};

// Function to update dashboard chart based on selected graph type
function updateDashboard() {
    const graphType = document.getElementById("graphType").value;
    const selectedCategory = document.getElementById("categoryFilter").value;
    const monthlyData = Array(12).fill(0);

    // Calculate data based on selected graph type
    if (graphType === "total") {
        expenses.forEach(expense => {
            const month = expense.date.getMonth();
            monthlyData[month] += expense.amount;
        });
    } else if (graphType === "category" && selectedCategory) {
        expenses
            .filter(expense => expense.category === selectedCategory)
            .forEach(expense => {
                const month = expense.date.getMonth();
                monthlyData[month] += expense.amount;
            });
    }

    // Update chart data
    window.dashboardChart.data.datasets[0].data = monthlyData;
    window.dashboardChart.data.datasets[0].label = graphType === "total" ? 'Total Monthly Expenses' : `Expenses for ${selectedCategory}`;
    window.dashboardChart.update();
}
