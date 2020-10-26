// Define initial map variable
let myMap = L.map('mapid');

// Function that clears search input
const clearInput = () => {
	$('.search-input').val('');
};

clearInput();

// Function that clears all data from the info div
const clearSearch = () => {
	$('.get-ip').empty();
	$('.get-location').empty();
	$('.get-timezone').empty();
	$('.get-isp').empty();
};

// Function that generates inital map
const initialMap = async (lat, lng) => {
	const tokenUrl = '/grabToken';
	const mapboxFetch = await fetch(tokenUrl);
	const mapboxToken = await mapboxFetch.json();

	myMap = myMap.setView([lat, lng], 11);

	L.marker([lat, lng]).addTo(myMap);

	L.tileLayer(
		'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
		{
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
			id: 'mapbox/streets-v11',
			tileSize: 512,
			zoomOffset: -1,
			accessToken: mapboxToken.key
		}
	).addTo(myMap);
};

// Function that updates map
const updateMap = (lat, lng) => {
	L.marker([lat, lng]).addTo(myMap);
	myMap.panTo(new L.LatLng(lat, lng));
};

// Function that is executed when page is initially loaded
const initialSearch = async () => {
	try {
		const searchUrl = '/api';
		const res = await fetch(searchUrl);
		const ipData = await res.json();

		$('.get-ip').append(ipData.ip);
		$('.get-location').append(
			ipData.location.city + ', ' + ipData.location.region
		);
		$('.get-timezone').append('UTC ' + ipData.location.timezone);
		$('.get-isp').append(ipData.as.name);
		initialMap(ipData.location.lat, ipData.location.lng);
	} catch (err) {
		document.getElementById('error').innerHTML =
			'There was an error processing your request';
	}
};

initialSearch();

// Function that takes search input and uses ipify api to locate ip address
const ipSearch = async () => {
	clearSearch();
	const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	const searchInput = $('.search-input').val();

	if (searchInput.match(ipRegex)) {
		try {
			const searchUrl = `/api/ip/${searchInput}`;
			const res = await fetch(searchUrl);
			const data = await res.json();

			$('.get-ip').append(data.ip),
				$('.get-location').append(data.location.city),
				$('.get-timezone').append('UTC ' + data.location.timezone),
				$('.get-isp').append(data.as.name),
				updateMap(data.location.lat, data.location.lng);
		} catch (err) {
			document.getElementById('error').innerHTML =
				'There was an error processing your request';
		}
	} else {
		try {
			const searchUrl = `/api/domain/${searchInput}`;
			const res = await fetch(searchUrl);
			const data = await res.json();

			$('.get-ip').append(data.ip),
				$('.get-location').append(data.location.city),
				$('.get-timezone').append('UTC ' + data.location.timezone),
				$('.get-isp').append(data.as.name),
				updateMap(data.location.lat, data.location.lng);
		} catch (err) {
			document.getElementById('error').innerHTML =
				'There was an error processing your request';
		}
	}
};

// Runs ipSearch function on click
$('.submit-btn').click((e) => {
	e.preventDefault();
	ipSearch();
});
