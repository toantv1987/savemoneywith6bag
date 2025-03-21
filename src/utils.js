// Update the date and time display
export function updateDateTime() {
  const dateElement = document.getElementById('current-date');
  const timeElement = document.getElementById('current-time');
  
  const now = new Date();
  
  // Format date as "Day, Month DD, YYYY"
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateElement.textContent = now.toLocaleDateString(undefined, dateOptions);
  
  // Format time as "HH:MM:SS"
  timeElement.textContent = now.toLocaleTimeString();
}
