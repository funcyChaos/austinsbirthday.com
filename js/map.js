async function initMap() {
	const {ColorScheme} 	= await google.maps.importLibrary("core")
	const location 				= {lat: 36.7650533, lng: -119.7995578}
	const map 						= new google.maps.Map(document.getElementById("map"), {
		mapId: 							"b5ab1e58702910f3",
    center: 						location,
		zoom: 							16,
		colorScheme:				ColorScheme.DARK,
		disableDefaultUI: 	true, 
	})

	new google.maps.marker.AdvancedMarkerElement({
		position: location,
		map: map,
	})
}