async function initMap(where){
	const {ColorScheme} 	= await google.maps.importLibrary("core")
	const location 				= {lat: where.latitude, lng: where.longitude}
	const map 						= new google.maps.Map(document.getElementById("map"), {
		mapId: 							where.mapid,
    center: 						location,
		zoom: 							16,
		colorScheme:				ColorScheme.DARK,
		disableDefaultUI: 	true, 
	})
	
	class Popup extends google.maps.OverlayView {
		position
    containerDiv
    constructor(position, content){
			super()
			this.position = position;
      content.classList.add("popup-bubble")

      // This zero-height div is positioned at the top of the bubble.
      const bubbleAnchor = document.createElement("div");

      bubbleAnchor.classList.add("popup-bubble-anchor");
      bubbleAnchor.appendChild(content);
      // This zero-height div is positioned at the bottom of the tip.
      this.containerDiv = document.createElement("div");
      this.containerDiv.classList.add("popup-container");
      this.containerDiv.appendChild(bubbleAnchor);
      // Optionally stop clicks, etc., from bubbling up to the map.
      Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    /** Called when the popup is added to the map. */
    onAdd(){
      this.getPanes().floatPane.appendChild(this.containerDiv);
    }
    /** Called when the popup is removed from the map. */
    onRemove(){
      if (this.containerDiv.parentElement) {
        this.containerDiv.parentElement.removeChild(this.containerDiv);
      }
    }
    /** Called each frame when the popup needs to draw itself. */
    draw() {
      const divPosition = this.getProjection().fromLatLngToDivPixel(
        this.position,
      );
      // Hide the popup when it is far out of view.
      const display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
          ? "block"
          : "none";

      if(display === "block"){
        this.containerDiv.style.left = divPosition.x + "px";
        this.containerDiv.style.top = divPosition.y + "px";
      }

      if(this.containerDiv.style.display !== display){
        this.containerDiv.style.display = display;
      }
    }
  }

	const contentDiv = document.createElement("div");
	contentDiv.id = "content";
	contentDiv.innerHTML = where.popup;

  popup = new Popup(
    new google.maps.LatLng(location),
    contentDiv
  );

	const marker = new google.maps.marker.AdvancedMarkerElement({
		position: location,
		map: map,
	})

	popup.setMap(map)
	const newCenter = {
		lat: popup.position.lat() + 100 / Math.pow(2, map.getZoom()),
		lng: popup.position.lng(),
	}
	map.panTo(newCenter)

	marker.addListener("gmp-click", () => {
		popup.setMap(map)
		const newCenter = {
			lat: popup.position.lat() + 100 / Math.pow(2, map.getZoom()),
			lng: popup.position.lng(),
		}
		map.panTo(newCenter)
	})
	map.addListener("click", ()=>{
		popup.setMap(null)
	})
}

window.initMap = initMap;