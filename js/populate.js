const root = document.getElementById("root")
const submit = document.getElementById("submit_button")
const passInput = document.getElementById("password_input")
const intro = document.createElement("section")
const localeSect = document.createElement('section')
const mapSect = document.createElement("section")
const mapDiv = document.createElement("div")
mapDiv.id = "map"
mapSect.appendChild(mapDiv)
const typing = document.getElementById("typing_div")
let isSubmit = false
passInput.addEventListener("keydown", e=>{
	if(e.key === "Enter"){
		isSubmit = true
		submitPassword()
	}
	typing.innerHTML = "&#x1F440;"
})
submit.addEventListener("click", ()=>submitPassword())
function submitPassword(){
	const password = passInput.value
	console.log(password)
	fetch("https://www.decorpo.co/wp-json/birthday/verify", {
		method: 	'POST',
		headers: 	{'Content-Type': 'application/json'},
		body:			JSON.stringify({password: password})
	})
	.then(response=>{
		if(response.ok){
			typing.innerHTML = "Good Guess &#128527;"
			return response.json()
		}else{
			typing.innerHTML = "Wrong Password &#128544;"
			isSubmit = false
			return false
		}
	})
	.then(data=>{
		console.log(data)
		if(data){
			localeSect.innerHTML = data.content.locale
			intro.innerHTML = data.content.intro
			root.appendChild(intro)
			root.appendChild(localeSect)
			root.appendChild(mapSect)
			buildMap(data.location)
		}
	})
}
function buildMap(location){
	const map = L.map("map").setView([location.latitude + .005, location.longitude], 15)
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map)
	const userMarker = L.marker([location.latitude, location.longitude], {
		icon: L.icon({
		iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
		iconSize: [30, 30],
		iconAnchor: [15, 30],
		popupAnchor: [0, -30],
		}),
	}).addTo(map)
	userMarker.bindPopup(location.popup).openPopup()
}