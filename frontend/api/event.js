document.addEventListener("DOMContentLoaded", async () => {
  const eventsWrapper = document.getElementById("event-cards");
  const createEventButton = document.getElementById("create-event");

  // DECODE TOKEN
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    const decodedToken = parseJwt(token);
    const isAdmin = decodedToken.isAdmin;

    // Hide the create event button if the user is not an admin
    if (!isAdmin) createEventButton.style.display = "none";
  } else createEventButton.style.display = "none";

  function parseJwt(token) {
    // Extract the base64url encoded payload
    var base64Url = token.split(".")[1];

    // Convert the base64url encoded payload to standard base64
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Decode the base64 encoded payload
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    // Parse the JSON payload
    return JSON.parse(jsonPayload);
  }

  // GET ALL EVENTS IN EVENT MANAGEMENT PAGE
  (async function loadEvents() {
    try {
      // Fetch events from the backend
      const response = await fetch("http://localhost:3001/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.error === false) {
        const events = data.events;

        // Clear existing events
        eventsWrapper.innerHTML = "";

        // Populate the events wrapper
        events.forEach((event) => {
          const eventCard = createEventCard(event);
          eventsWrapper.appendChild(eventCard);
        });
      } else {
        alert(data.reason || "Failed to load events.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("An error occurred while loading events.");
    }
  })();

  // Create Event Card Functionality
  function createEventCard(event) {
    const eventCard = document.createElement("div");
    eventCard.classList.add("col-md-4");
    eventCard.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${event.title}</h5>
          <p class="card-text">${event.description}</p>
          <a href="event-details.html?id=${event._id}" class="btn btn-custom-primary">
            Learn More
          </a>
        </div>
      </div>
    `;
    return eventCard;
  }

  // Event Search Functionality
  document
    .getElementById("search-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const keyword = document
        .getElementById("search-input")
        .value.toLowerCase();
      const location = document
        .getElementById("location-filter")
        .value.toLowerCase();
      const date = document.getElementById("date-filter").value;
      const category = document
        .getElementById("category-filter")
        .value.toLowerCase();
      const events = document.querySelectorAll("#event-cards .col-md-4");

      events.forEach((event) => {
        const eventTitle = event
          .querySelector(".card-title")
          .textContent.toLowerCase();
        const eventLocation = event.getAttribute("data-location").toLowerCase();
        const eventDate = event.getAttribute("data-date");
        const eventCategory = event.getAttribute("data-category").toLowerCase();

        const matchesKeyword = !keyword || eventTitle.includes(keyword);
        const matchesLocation = !location || eventLocation === location;
        const matchesDate = !date || eventDate === date;
        const matchesCategory = !category || eventCategory === category;

        if (
          matchesKeyword &&
          matchesLocation &&
          matchesDate &&
          matchesCategory
        ) {
          event.style.display = "block";
        } else {
          event.style.display = "none";
        }
      });
    });
});
