document.addEventListener("DOMContentLoaded", async () => {
  const eventForm = document.querySelector("#event-form");

  // CREATE EVENT
  eventForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      // Collect form values
      const title = document.getElementById("event-title").value.trim();
      const description = document
        .getElementById("event-description")
        .value.trim();
      const date = document.getElementById("event-date").value.trim();
      const time = document.getElementById("event-time").value.trim();
      const location = document.getElementById("event-location").value.trim();
      const price = document.getElementById("ticket-price").value.trim();
      const privacySetting = document
        .getElementById("event-privacy")
        .value.trim();
      console.log(title, description);

      // Validation
      if (
        !title ||
        !description ||
        !date ||
        !time ||
        !location ||
        !price ||
        !privacySetting
      ) {
        alert("All fields are required. Please fill in the form.");
        return;
      }

      // Send data to the backend
      const response = await fetch(
        "http://localhost:3001/event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
          body: JSON.stringify({
            title,
            description,
            date,
            time,
            location,
            price,
            privacySetting,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.error === false) {
        alert("Event created successfully!");
        window.location.href = "../pages/events.html"; // Redirect to events list page
      } else {
        alert(data.reason || "Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the event. Please try again.");
    }
  });
});
