// Global variables
var map;

// Hard-coded locations
var locations = [
	{
		name: "Parking Lot 26",
		lat: 33.9749888,
		long: -117.3332816
	},
	{
		name: "Spieth Hall",
		lat: 33.9724408,
		long: -117.3267614
	},
	{
		name: "Psychology Building",
		lat: 33.9722429,
		long: -117.3264968
	},
	{
		name: "The HUB",
		lat: 33.9744116,
		long: -117.3279558
	},
	{
		name: "Bell Tower",
		lat: 33.9736597,
		long: -117.3277122
	},
	{
		name: "Bourns A125",
		lat: 33.975592,
		long: -117.327635
	},
	{
		name: "UCR Recreation Center",
		lat: 33.9705396,
		long: -117.328748
	},
	{
		name: "Pentland Hills Residence",
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
	this.street = "";
	this.city = "";

	// visibility setting
	this.visible = ko.observable(true);

	// Give each location a marker
	this.marker = new google.maps.Marker({
		position: {lat: data.lat, lng: 	data.long},
		title: data.name
	});

}


function ViewModel() {
	var self = this;

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

	// Create markers based on visibility
	// Possibly make it also based on filter
	this.listArray().forEach(function(object) {
		if (object.visible() == true) {
			object.marker.setMap(map);
		}
		else {
			object.marker.setMap(null);
		}
	});

}



// Allows initialization of app when Google makes callback
function initApp() {
	ko.applyBindings(new ViewModel());
}