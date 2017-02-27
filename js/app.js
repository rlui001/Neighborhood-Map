// Global variables
var map;
var CLIENT_ID = '3M2YWCXV1EUHGMV5G3ZECFD1NSAS3MK3L3XP13YHGWAKMQ1I';
var CLIENT_SECRET = '5XHE0YMUE5IYD0AMSFZXE34VBT2HRTCTIM4XYOHQXGAUHVAP';

// Hard-coded locations
var locations = [
	{
		name: 'Lot 26',
		lat: 33.9749888,
		long: -117.3332816
	},
	{
		name: 'Spieth Hall',
		lat: 33.9724408,
		long: -117.3267614
	},
	{
		name: 'Psychology Building',
		lat: 33.9722429,
		long: -117.3264968
	},
	{
		name: 'The HUB',
		lat: 33.9744116,
		long: -117.3279558
	},
	{
		name: 'Bell Tower',
		lat: 33.9736597,
		long: -117.3277122
	},
	{
		name: 'Bourns A125',
		lat: 33.975592,
		long: -117.327635
	},
	{
		name: 'UCR Recreation Center',
		lat: 33.9705396,
		long: -117.328748
	},
	{
		name: 'Pentland Hills Residence',
		lat: 33.9561598,
		long: -117.325555
	}
	// Map area is University of California, Riverside
	// lat: 33.973804
	// long: -117.3312105

];

// Location object constructor
function Location(data) {
	var self = this;

	this.name = data.name;
	this.lat = data.lat;
	this.long = data.long;
	this.checkins = '';
	this.street = '';
	this.city = '';

	// infowindow
	this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

	// visibility setting
	this.visible = ko.observable(true);

	// Give each location a marker
	this.marker = new google.maps.Marker({
		position: {lat: data.lat, lng: 	data.long},
		title: data.name
	});

	// Get auth token from foursquare
	var URL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.long + '&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20170225' + '&query=' + this.name;
	$.getJSON(URL).done(function(results) {
		var data = results.response.venues[0];
		if (data.location.formattedAddress.length == 2) {
			self.street = "";
			self.city = data.location.formattedAddress[0];
		}
		else {
			self.street = data.location.formattedAddress[0];
			self.city = data.location.formattedAddress[1];
		}
		self.checkins = data.stats.checkinsCount;
		console.log(data);
	}).fail(function() {
		// Eventually fix; alert pops up for each object 
		alert('Ran into an issue while attempting API call from FourSquare.');
	});

	// Add bounce animation when clicked

	this.marker.addListener('click', bounce);

	// separate function needed to click on the marker
	// contentString and infoWindow created separately so it gets the updated values after API call from foursquare
	function bounce() {
	self.contentString = '<h1 id="title">'+self.name+'</h1>'+'<div id="body">'+ self.street + '</div>' + '<div id="body">' + self.city +'</div>' + '<div id="body">Check-ins: ' + self.checkins + '</div>';
	self.infoWindow.setContent(self.contentString);
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
			self.infoWindow.open(map,self.marker);
			setTimeout(function() {
				self.marker.setAnimation(null);
			}, 2700);
	};

	this.animate = function () {
	self.contentString = '<h1 id="title">'+self.name+'</h1>'+'<div id="body">'+ self.street + '</div>' + '<div id="body">' + self.city +'</div>' + '<div id="body">Check-ins: ' + self.checkins + '</div>';
	self.infoWindow.setContent(self.contentString);
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
			self.infoWindow.open(map, self.marker);
			setTimeout(function() {
				self.marker.setAnimation(null);
			}, 2700);
	};

}


function ViewModel() {
	var self = this;

	// Search filter variable
	this.filterLocation = ko.observable("");

	// Create the array for the list
	this.listArray = ko.observableArray([]);

	// Populate the array with the hard-coded locations
	locations.forEach(function(loc) {
		self.listArray.push(new Location(loc));
	});

	// Initialize map area(UCR) using Google Maps
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: {lat: 33.973804, lng: -117.3312105}
	});

	//Place markers based on visibility setting
	placeMarkers = ko.computed(function() {
		self.listArray().forEach(function(object) {
			if (object.visible() === true) {
				object.marker.setMap(map);
			}
			else {
				object.marker.setMap(null);
			}
		});
	});

	// Create a filtered list and also update visibility setting
	this.filterLocations = ko.computed(function() {
		if(!self.filterLocation()) {
			self.listArray().forEach(function(object) {
				object.visible(true);
			});
			return self.listArray();
		}
		else {
			return ko.utils.arrayFilter(self.listArray(), function(fil) {
				filter = self.filterLocation().toLowerCase();
				// If name contains anything from filtered string, include it
				if (fil.name.toLowerCase().indexOf(filter) !== -1) {
					fil.visible(true);
					return fil.name.toLowerCase().indexOf(filter) !== -1;
				}
				else {
					fil.visible(false);
				}

			});
		}
	});





}



// Allows initialization of app when Google makes callback
function initApp() {
	ko.applyBindings(new ViewModel());
}