// make api call to fetch a particular event details using its id from query params on dom load
document.addEventListener("DOMContentLoaded", async () => {
  const eventId = new URLSearchParams(window.location.search).get("id");
  const eventDetails = await fetchEventDetails(eventId);

  //   prefill the event form in edit-event.html with event details
  if (eventDetails) {
    const eventForm = document.getElementById("event-form");
    eventForm.title.value = eventDetails.title;
    eventForm.description.value = eventDetails.description;
    const date = new Date(eventDetails.date);
    eventForm.date.value = `${date.getFullYear()}-${`0${
      date.getMonth() + 1
    }`.slice(-2)}-${`0${date.getDate()}`.slice(-2)}`;
    eventForm.time.value = eventDetails.time;
    eventForm.location.value = eventDetails.location;
    eventForm.ticket_price.value = eventDetails.price;
    eventForm.privacy.value = eventDetails.privacySetting;
  }

  //   fetch event details from api
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

  //   handle form submission
  const eventForm = document.getElementById("event-form");
  eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(eventForm);
    const eventData = Object.fromEntries(formData.entries());
    eventData.id = eventId;

    try {
      const payload = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        price: eventData.ticket_price,
        location: eventData.location,
        privacySetting: eventData.privacy,
      };

      const response = await fetch(
        `http://localhost:3001/event/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok && data.error === false) {
        alert("Event updated successfully!");
        window.location.href = "../pages/event-management.html"; // Redirect to event management page
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  });
});
