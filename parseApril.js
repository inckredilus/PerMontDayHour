// Fetch and parse CSV data from a file
const fetchCsvData = async (filePath) => {
  const response = await fetch(filePath);
  const csv = await response.text();
  return parseCsvToObject(csv);
};

// Parse the CSV data into a structured object
const parseCsvToObject = (csv) => {
  const lines = csv.split('\n');
  const monthObject = {};

  lines.forEach(line => {
    const [dateTime, value] = line.split(';');
    if (!dateTime || !value) return;

    const [date, time] = dateTime.split(' ');
    const day = date.split('-')[2];
    const hour = parseInt(time.split(':')[0], 10);

    if (!monthObject[day]) {
      monthObject[day] = Array(24).fill(null); // Initialize an array for 24 hours
    }

    monthObject[day][hour] = parseFloat(value.replace(',', '.')); // Convert value to a number
  });

  return monthObject;
};

// Find and log values less than or equal to a given max value between 6:00 and 22:00 (excluding 22:00)
const findFilteredValues = (data, maxValue = 6) => {
  const filteredValues = [];

  for (const day in data) {
    for (let hour = 6; hour < 22; hour++) { // Updated to exclude 22:00
      if (data[day][hour] !== null && data[day][hour] <= maxValue) {
        filteredValues.push({ day, hour, value: data[day][hour] });
      }
    }
  }

  // Sort the filtered values by value in descending order
  filteredValues.sort((a, b) => b.value - a.value);

  return filteredValues.slice(0, 10); // Return only the top 10 values
};

// Display the data in the browser
window.onload = async () => {
  const monthData = await fetchCsvData('./april.csv'); // Assumes the CSV file is named 'data.csv' in the same directory

  // Find and display filtered values
  const filteredValues = findFilteredValues(monthData);
  const filteredElement = document.createElement('div');
  filteredElement.innerHTML = `<h2>Filtered values <= 6 kWh for 2024 April</h2>`;

  const listElement = document.createElement('ol');
  filteredValues.forEach(item => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.value} kWh - Day ${item.day} : ${item.hour}:00`;
    listElement.appendChild(listItem);
  });

  filteredElement.appendChild(listElement);
  document.body.appendChild(filteredElement);
};

console.log('Script loaded.');