const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8080;
const fetch = require('node-fetch');
require('dotenv').config();

app.listen(PORT, function () {
	console.log('Server listening on port ' + PORT);
});

app.use('/', express.static(path.join(__dirname, '/public')));

app.get('/api', async (req, res) => {
	try {
		const apiKey = process.env.IPIFYKEY;
		const baseQuery = 'https://geo.ipify.org/api/v1?apiKey=' + apiKey;
		const ipRes = await fetch(baseQuery);
		const ipData = await ipRes.json();
		res.send(ipData);
	} catch (err) {
		throw err;
	}
});

app.get('/grabToken', (req, res) => {
	const mapboxToken = process.env.MAPBOXTOKEN;
	res.send({ key: mapboxToken });
});

app.get('/api/ip/:ip', async (req, res) => {
	try {
		const apiKey = process.env.IPIFYKEY;
		const baseQuery = 'https://geo.ipify.org/api/v1?apiKey=' + apiKey;
		const searchQuery = baseQuery + '&ipAddress=' + req.params.ip;
		const ipRes = await fetch(searchQuery);
		const ipData = await ipRes.json();
		res.send(ipData);
	} catch (err) {
		throw err;
	}
});

app.get('/api/domain/:domain', async (req, res) => {
	try {
		const apiKey = process.env.IPIFYKEY;
		const baseQuery = 'https://geo.ipify.org/api/v1?apiKey=' + apiKey;
		const searchQuery = baseQuery + '&domain=' + req.params.domain;
		const ipRes = await fetch(searchQuery);
		const ipData = await ipRes.json();
		res.send(ipData);
	} catch (err) {
		throw err;
	}
});
