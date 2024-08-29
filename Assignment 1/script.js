document.addEventListener('DOMContentLoaded', () => {
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-links a');
  
    // Highlight the current menu item
    menuItems.forEach(menuItem => {
        if (menuItem.href === currentLocation) {
            menuItem.classList.add("active");
        }
  
        menuItem.addEventListener('click', () => {
            menuItems.forEach(item => item.classList.remove("active"));
            menuItem.classList.add("active");
        });
    });
  
    // Fetch booking data and populate the table
    fetch('/data')
      .then(response => response.json())
      .then(data => {
        populateTable(data);
      })
      .catch(error => console.error('Error fetching booking data:', error));
  
    // Fetch report data and update the revenue element
    fetch('/data/report')
      .then(response => response.json())
      .then(data => {
        document.getElementById('revenue').textContent = `Revenue (Overall): Rs. ${data[0]['sum(price)']}`;
        document.getElementById('rate').textContent = `Occupancy Rate: ${data[0][`count(price)/(SELECT count(room_no) FROM rooms)*100`]}%`
      })
      .catch(error => console.error('Error fetching revenue data:', error));
  
    // Refresh data periodically
    setInterval(() => {
      fetch('/data')
        .then(response => response.json())
        .then(data => {
          populateTable(data);
        })
        .catch(error => console.error('Error fetching booking data:', error));
      
      fetch('/data/report')
        .then(response => response.json())
        .then(data => {
          if (data.length > 0 && data[0]['sum(price)'] !== null) {
              document.getElementById('revenue').textContent = `Revenue (Past 1 Month): Rs. ${data[0]['sum(price)']}`;
          } else {
              document.getElementById('revenue').textContent = 'No revenue data available';
          }
        })
        .catch(error => console.error('Error fetching revenue data:', error));
    }, 60000);
  });

function populateTable(data) {
    const tableBody = document.querySelector('#booking-table tbody');
  
    // Clear existing rows
    tableBody.innerHTML = '';
  
    // Iterate over the data and create table rows
    data.forEach(item => {
        const row = document.createElement('tr');

        const paymentStatusColor = item.payment_status.toLowerCase() === 'paid' ? '#28a745' : '#dc3545';
  
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.room_no}</td>
            <td>${item.fname} ${item.lname}</td>
            <td>${item.occupants}</td>
            <td>${item.travel_through}</td>
            <td>${item.smoking === 1 ? 'Smoking' : 'Non-Smoking'}</td>
            <td style="color: ${paymentStatusColor};">${item.payment_status}</td>
            <td>${item.payment_mode}</td>
        `;
  
        tableBody.appendChild(row);
    });
}
