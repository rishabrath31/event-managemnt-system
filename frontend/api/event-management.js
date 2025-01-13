let totalEvents = 0;
let totalTicketsSold = 0; // Placeholder, since there's no sales data in the response
let totalTicketsAvailable = 0; // Placeholder, adjust if you have this data

document.addEventListener("DOMContentLoaded", function () {
  // Fetch event data from the backend
  fetch("http://localhost:3001/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.error && data.events) {
        const eventsTable = document.getElementById("events-table");
        const eventSummaryElement = document.querySelector(".event-summary p");

        data.events.forEach((event) => {
          // Create a new table row for each event
          const row = document.createElement("tr");
          row.id = event._id;

          // Event Title
          const titleCell = document.createElement("td");
          titleCell.textContent = event.title;
          row.appendChild(titleCell);

          // Event Date
          const dateCell = document.createElement("td");
          const eventDate = new Date(event.date);
          dateCell.textContent = eventDate.toLocaleDateString();
          row.appendChild(dateCell);

          // Event Status (Placeholder for now)
          const statusCell = document.createElement("td");
          const statusBadge = document.createElement("span");
          statusBadge.classList.add("badge", "bg-success");
          statusBadge.textContent = "Active"; // You can update this based on your status logic
          statusCell.appendChild(statusBadge);
          row.appendChild(statusCell);

          // Actions
          const actionsCell = document.createElement("td");
          actionsCell.innerHTML = `
            <button class="btn btn-primary btn-sm btn-action" onclick="editEvent('${event._id}')">Edit</button>
            <button class="btn btn-danger btn-sm btn-action" onclick="deleteEvent('${event._id}')">Delete</button>
          `;
          row.appendChild(actionsCell);

          // Append the row to the table body
          eventsTable.appendChild(row);

          // Increment the total events counter
          totalEvents++;
        });

        // Update event summary
        eventSummaryElement.innerHTML = `
          <strong>Total Events:</strong> ${totalEvents}<br>
        `;
      } else {
        console.error("Error fetching events or data is malformed.");
      }
    })
    .catch((error) => console.error("Error fetching events:", error));
});

// Placeholder function to edit an event
function editEvent(eventId) {
  // Redirect to edit-event.html and pass id in query params
  window.location.href = `edit-event.html?id=${eventId}`;
}

// function to delete an event

async function deleteEvent(eventId) {
  console.log("Delete event:", eventId);

  try {
    const response = await fetch(
      `http://localhost:3001/event/${eventId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.error === false) {
      console.log(`Event ${eventId} deleted successfully`);
      alert("Event Deleted Successfully");
      // Optionally, remove the event row from the DOM
      const eventRow = document.getElementById(eventId);
      if (eventRow) {
        eventRow.remove(); // Remove the event from the table
      }

      // Update the total events counter
      const eventSummaryElement = document.querySelector(".event-summary p");
      totalEvents--;

      // Update event summary
      eventSummaryElement.innerHTML = `
          <strong>Total Events:</strong> ${totalEvents}<br>
        `;
    } else {
      console.error("Failed to delete event:", data.reason);
      alert(data.reason || "Failed to delete the event.");
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    alert("Error deleting the event.");
  }
}
