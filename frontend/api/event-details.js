// fetch a particular event details on dom load
document.addEventListener("DOMContentLoaded", async () => {
  const eventId = new URLSearchParams(window.location.search).get("id");
  const eventDetails = await fetchEventDetails(eventId);

  if (eventDetails) {
    const eventDetailsWrapper = document.getElementById("event-details");
    eventDetailsWrapper.innerHTML = `<h1 class="mb-3">${eventDetails.title}</h1>
     <p><strong>Date:</strong> ${new Date(
       eventDetails.date
     ).toLocaleDateString()}</p>
     <p><strong>Time:</strong> ${new Date(
       `January 1, 1970 ${eventDetails.time}`
     ).toLocaleString("en-US", {
       hour: "numeric",
       minute: "numeric",
       hour12: true,
     })}</p>
     <p><strong>Location:</strong> ${eventDetails.location}</p>
     <p>${eventDetails.description}</p>
     <p><strong>Price:</strong> $${eventDetails.price} per ticket</p>
     <a class="custom-link mt-3" onclick="buyTicket('${eventId}')">Purchase Now</a>`;
  }

  // fetch event details from api
  async function fetchEventDetails(eventId) {
    try {
      const response = await fetch(
        `http://localhost:3001/event/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data.event;
    } catch (error) {
      console.error("Error fetching event details:", error);
      return null;
    }
  }
});

// make api call to buy ticket for a particular event
async function buyTicket(eventId, quantity = 1) {
  try {
    const response = await fetch(
      `http://localhost:3001/buytickets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify({ eventId, quantity }),
      }
    );

    const data = await response.json();

    if (response.ok && data.error === false) {
      alert("Ticket purchase successful!");
      // redirect to event page
      window.location.href = "../pages/events.html";
    } else {
      alert(data.reason || "An error occurred while buying ticket.");
    }
  } catch (error) {
    console.error("Error buying ticket:", error);
    return null;
  }
}
