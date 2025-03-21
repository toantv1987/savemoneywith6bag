import Chart from 'chart.js/auto';
import { SensorData } from './sensorData.js';
import { updateDateTime } from './utils.js';

// Initialize charts
let charts = {};
const timeLabels = Array.from({ length: 10 }, (_, i) => `${i * 5}m ago`).reverse();

// Initialize sensor data
const sensorData = new SensorData();

// Update the date and time display
setInterval(updateDateTime, 1000);
updateDateTime();

// Initialize charts for each sensor
function initializeCharts() {
  const sensors = ['temperature', 'humidity', 'pressure'];
  const colors = {
    temperature: {
      borderColor: 'rgba(231, 76, 60, 1)',
      backgroundColor: 'rgba(231, 76, 60, 0.1)'
    },
    humidity: {
      borderColor: 'rgba(52, 152, 219, 1)',
      backgroundColor: 'rgba(52, 152, 219, 0.1)'
    },
    pressure: {
      borderColor: 'rgba(46, 204, 113, 1)',
      backgroundColor: 'rgba(46, 204, 113, 0.1)'
    }
  };

  sensors.forEach(sensor => {
    const ctx = document.getElementById(`${sensor}-chart`).getContext('2d');
    
    charts[sensor] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timeLabels,
        datasets: [{
          label: sensor.charAt(0).toUpperCase() + sensor.slice(1),
          data: Array(10).fill(null),
          borderColor: colors[sensor].borderColor,
          backgroundColor: colors[sensor].backgroundColor,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: colors[sensor].borderColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(200, 200, 200, 0.2)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  });
}

// Update sensor displays with new data
function updateSensorDisplays() {
  const sensors = ['temperature', 'humidity', 'pressure'];
  
  sensors.forEach(sensor => {
    const value = sensorData.getCurrentValue(sensor);
    const valueElement = document.getElementById(`${sensor}-value`);
    const statusElement = document.getElementById(`${sensor}-status`);
    
    valueElement.textContent = value.toFixed(1);
    
    // Update status indicator
    const status = sensorData.getStatus(sensor, value);
    statusElement.textContent = status.label;
    statusElement.className = 'status-indicator ' + status.class;
    
    // Update chart
    const chart = charts[sensor];
    chart.data.datasets[0].data.shift();
    chart.data.datasets[0].data.push(value);
    chart.update();
  });
  
  // Update system summary
  document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
  
  // Check for alerts
  const alerts = sensorData.getAlerts();
  updateAlertsList(alerts);
  
  // Update system status based on alerts
  updateSystemStatus(alerts);
}

// Update the alerts list
function updateAlertsList(alerts) {
  const alertsList = document.getElementById('alerts-list');
  
  if (alerts.length === 0) {
    alertsList.innerHTML = '<li class="no-alerts">No recent alerts</li>';
    return;
  }
  
  alertsList.innerHTML = '';
  alerts.slice(0, 3).forEach(alert => {
    const li = document.createElement('li');
    li.className = alert.level;
    li.textContent = `${alert.time} - ${alert.message}`;
    alertsList.appendChild(li);
  });
}

// Update system status based on alerts
function updateSystemStatus(alerts) {
  const systemStatus = document.getElementById('system-status');
  
  if (alerts.length === 0) {
    systemStatus.textContent = 'Operational';
    systemStatus.style.color = '#2ecc71';
  } else {
    const hasCritical = alerts.some(alert => alert.level === 'danger');
    
    if (hasCritical) {
      systemStatus.textContent = 'Critical';
      systemStatus.style.color = '#e74c3c';
    } else {
      systemStatus.textContent = 'Warning';
      systemStatus.style.color = '#f39c12';
    }
  }
}

// Set up refresh button event listeners
function setupRefreshButtons() {
  const refreshButtons = document.querySelectorAll('.refresh-btn');
  
  refreshButtons.forEach(button => {
    button.addEventListener('click', () => {
      const sensor = button.dataset.sensor;
      sensorData.refreshSensor(sensor);
      updateSensorDisplays();
      
      // Add animation to the button
      button.classList.add('refreshing');
      setTimeout(() => {
        button.classList.remove('refreshing');
      }, 500);
    });
  });
}

// Initialize the dashboard
function initializeDashboard() {
  initializeCharts();
  setupRefreshButtons();
  
  // Initial data update
  sensorData.refreshAllSensors();
  updateSensorDisplays();
  
  // Set up periodic updates
  setInterval(() => {
    sensorData.refreshAllSensors();
    updateSensorDisplays();
  }, 5000);
}

// Start the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);
