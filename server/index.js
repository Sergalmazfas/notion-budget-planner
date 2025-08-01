const express = require('express');
const getBudgetData = require('./notion');
const { checkNotionConnection } = require('./notion');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

// Serve static files from the React app
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/api', (req, res) => {
	res.json({ message: "Hello from server!" });
});

app.get('/health', async (req, res) => {
	const notionHealth = await checkNotionConnection();
	if (notionHealth.status === 'ok') {
		res.status(200).json({
			status: 'ok',
			dependencies: {
				notion: 'ok'
			}
		});
	} else {
		res.status(503).json({
			status: 'error',
			dependencies: {
				notion: 'error',
				details: notionHealth.error,
			}
		});
	}
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
