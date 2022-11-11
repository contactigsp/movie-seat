const container = document.querySelector(".container");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
const rowsFront = document.querySelectorAll(".room-front .row");
const rowsMiddle = document.querySelectorAll(".room-middle .row");

const width = 20;

// Fill rows with seats according to the width's value
function createSeats() {
  [...rowsFront].map((row) => {
    for (let i = 0; i < width - 4; i++) {
      const seat = document.createElement("div");
      seat.setAttribute("class", "seat");
      row.appendChild(seat);
    }
  });
  [...rowsMiddle].map((row) => {
    for (let i = 0; i < width; i++) {
      const seat = document.createElement("div");
      seat.setAttribute("class", "seat");
      row.appendChild(seat);
    }
  });
}

createSeats();

// Inserting id into seats
const allSeats = document.querySelectorAll(".row .seat");
const seatsIndexes = [...allSeats].map((seat, index) => index);

seatsIndexes.forEach((index) => {
  const parentId = [...allSeats][index].parentElement.id;
  [...allSeats][index].setAttribute("id", `${parentId}${index}`);
});

// Set all the occupied seats
function setOccupiedSeats() {
  const occupiedSeats = [
    55, 56, 84, 85, 109, 111, 138, 162, 163, 178, 193, 194, 219,
  ];
  occupiedSeats.forEach((seat) => allSeats[seat].classList.add("occupied"));
}
setOccupiedSeats();
//
populateUI();

let ticketPrice = parseInt(movieSelect.value);

// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

// Change color of alphabetical characters
function changeSeatLetterColor(element) {
  const regex = /[A-Za-z]/g;
  let text = element.innerText
    .split("")
    .map((char) => {
      if (char.match(regex)) {
        return `<span class="seatLetterId"> ${char}</span>`;
      } else {
        return char;
      }
    })
    .join("");
  if (element.innerText === "") {
    element.innerText = "Please select your seats";
  } else {
    element.innerHTML = text;
  }
}

// Update total and count
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row  .seat.selected");
  const selectedSeatsCount = selectedSeats.length;

  // Display the selected seats ids
  const seatsIndex = [...selectedSeats].map((seat) =>
    [...allSeats].indexOf(seat)
  );
  const seatsId = seatsIndex.map((index) => allSeats[index].id);
  const selectedSeatsDisplay = document.querySelector(".selectedSeatsDisplay");

  // Current selected seats UI

  selectedSeatsDisplay.innerText = seatsId;
  changeSeatLetterColor(selectedSeatsDisplay);

  // Saving to Local Storage in order to be able to refresh page and don't loose selected info
  // We have to stringify because the setItem accepts only strings
  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;

}

// Get data from localstorage and populate UI
function populateUI() {
  // JSON.parse() does exactly the opposite of JSON.stringify.
  // And we're doing this because we saved the selectedSeats as a string,
  // because the setItem requires this way.
  // So, now it means it is an array again.
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    allSeats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
}

// Movie select event
movieSelect.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;
  // To get the selected movie we use the property "selectedIndex"
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
});

// Seat click event
container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected");

    updateSelectedCount();
  }
});

// Initial count and total set
updateSelectedCount();
