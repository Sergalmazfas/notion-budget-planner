const express = require('express');
const getBudgetData = require('./notion');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

// Serve static files from the React app
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/api', (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.get('/budgetData', async (req, res) => {
	const options = {
		type: req.query.type,
		date: req.query.date,
		interval: req.query.interval
	}
	
	const data = await getBudgetData(options);
	res.json(data);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
