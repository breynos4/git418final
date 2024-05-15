'use strict';

//weather
function getWeather(lat, long){
	let weatherSection = document.getElementById("weather");
	let output = "";
	weatherSection.innerHTML = "";
	let apiKey = "ae93ec6ecbd507f6e9b1269411b466b2";
	let imgUrlStart = "http://openweathermap.org/img/wn/";
	let imgUrlEnd = "@2x.png";
	let endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=${apiKey}`;
	let xhr = new XMLHttpRequest();
	xhr.addEventListener("load", function(){
		if(this.status == 200){
			let ms = this.response.dt * 1000;
			let date = new Date(ms);
			ms = this.response.sys.sunrise * 1000;
			let rise = new Date(ms);
			ms = this.response.sys.sunset * 1000;
			let set= new Date(ms);
			let iconCode = this.response.weather[0].icon;
			let iconUrl = `${imgUrlStart}${iconCode}${imgUrlEnd}`;
					output += `<h4>Today's Weather for ${this.response.name}</h4>
							<img src="${iconUrl}" alt="${this.response.weather[0].main}">
							<dl>
								<dt>Current Conditions:</dt>
								<dd>${this.response.weather[0].description}</dd>
								<dt>Current Temp:</dt>
								<dd>${Math.round(this.response.main.temp)}&deg;</dd>
								<dt>Sunrise:</dt>
								<dd>${new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'medium' }).format(rise)}</dd>
								<dt>Sunset:</dt>
								<dd>${new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'medium' }).format(set)}</dd>
							</dl>`;
			weatherSection.classList.remove("hidden");
			weatherSection.classList.add("display");
			weatherSection.innerHTML = output;
		}else{
			weatherSection.innerHTML = "There was an issue with your call to the Open Weather API. Check the endopint and try again.";
		}
	});
	xhr.responseType = "json";
	xhr.open("GET", endpoint);
	xhr.send();
}
function getLocation(e){
	e.preventDefault();
	if(!navigator.geolocation) {
		document.getElementById("weather").textContent = 'Geolocation is not supported by your browser';
	} else {
		navigator.geolocation.getCurrentPosition(success);
		function success(location){
			getWeather(location.coords.latitude, location.coords.longitude);
			console.log(location);
		}
	}
}

//tabs
$( function() {
  $( "#tabs" ).tabs();
} );

let listItems = [];

// game list form
function addToList(e){
	e.preventDefault();
	let itemInput = document.getElementById("item");
	let errorSpan = document.querySelector("#appendString .message");
	itemInput.classList.remove("errorInput");
	errorSpan.classList.remove("error"); 
	if(itemInput.value === ""){
		itemInput.classList.add("errorInput");
		errorSpan.classList.add("error");
	}else{
		if(localStorage.getItem("todoList")){
			listItems.push(itemInput.value);
			localStorage.todoList = listItems.join("|");
			displayList();
			itemInput.value = "";
		}else{
			localStorage.setItem("todoList", itemInput.value);
			displayList();
			itemInput.value = "";
		}
	}
}
// display game list on page load
function displayList(){
	let list = localStorage.getItem("todoList") || "";
	let counter = 0;
	if(list.length > 0){
		listItems = list.split("|");
		let todoList = document.getElementById("todoList");
		todoList.previousElementSibling.classList.remove("hidden");
		todoList.innerHTML = "";
		for(let item of listItems){
			let li = document.createElement("li");
			li.innerHTML = `<input type="checkbox" name="todo" id="${counter}"><span>${item}</span>`;
			todoList.appendChild(li);
			document.getElementById(counter).addEventListener("click", markAsDone);
			counter++;
		}
	}	
}
//modal popup
function markAsDone(e){
	let checkbox = e.target;
	let item = checkbox.nextElementSibling.textContent;
	let modal = document.getElementById("modal");
	document.getElementById("inner-modal").children[0].innerHTML = `Do you want to remove "${item}" from your list?`;
	modal.classList.remove("hidden");
	document.getElementById("confirm").addEventListener("click", function(){
		let list = localStorage.getItem("todoList");
		let todoList = document.getElementById("todoList");
		todoList.innerHTML = "";
		listItems = list.split("|");
		let index = listItems.indexOf(item);
		listItems.splice(index, 1);
		localStorage.todoList = listItems.join("|");
		displayList();
		modal.classList.add("hidden");
	});
	document.getElementById("cancel").addEventListener("click", function(){
		modal.classList.add("hidden");
		checkbox.checked = false;
	});
}

// ---------------------------------------------------------
// EVENT LISTENERS
document.getElementById("mySubmit").addEventListener("click", getLocation);

document.getElementById("itemSubmit").addEventListener("click", addToList);
window.onload = function(){
	displayList();
	displayUser();
};