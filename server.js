const express = require('express');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

// SQL Server configuration
const config = {
    user: 'your_db_user',
    password: 'your_db_password',
    server: 'localhost',
    database: 'your_db_name',
    options: {
        enableArithAbort: true,
    },
};

// Middleware to parse JSON
app.use(express.json());

// API endpoint to add an expense
app.post('/api/addExpense', async (req, res) => {
    try {
        await sql.connect(config);
        const { amount } = req.body;

        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const date = new Date().toLocaleString();

        await sql.query`INSERT INTO expenses (amount, date) VALUES (${amount}, ${date})`;

        res.status(201).json({ success: true, message: 'Expense added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        sql.close();
    }
});

// API endpoint to get all expenses
app.get('/api/getExpenses', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM expenses`;

        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        sql.close();
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
