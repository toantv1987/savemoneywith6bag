export class SensorData {
  constructor() {
    this.data = {
      temperature: {
        min: 15,
        max: 35,
        current: 22.5,
        history: [],
        thresholds: {
          warning: { low: 18, high: 28 },
          danger: { low: 15, high: 32 }
        }
      },
      humidity: {
        min: 20,
        max: 80,
        current: 45,
        history: [],
        thresholds: {
          warning: { low: 30, high: 65 },
          danger: { low: 20, high: 75 }
        }
      },
      pressure: {
        min: 980,
        max: 1040,
        current: 1013,
        history: [],
        thresholds: {
          warning: { low: 990, high: 1030 },
          danger: { low: 980, high: 1040 }
        }
      }
    };
    
    this.alerts = [];
  }
  
  // Generate a random value within the sensor's range
  generateRandomValue(sensor) {
    const sensorData = this.data[sensor];
    const range = sensorData.max - sensorData.min;
    
    // Generate a value that's somewhat close to the current value
    // to simulate realistic changes
    const maxChange = range * 0.05; // Max 5% change
    const change = (Math.random() * maxChange * 2) - maxChange;
    
    let newValue = sensorData.current + change;
    
    // Ensure the value stays within the min/max range
    newValue = Math.max(sensorData.min, Math.min(sensorData.max, newValue));
    
    return newValue;
  }
  
  // Refresh a specific sensor with new data
  refreshSensor(sensor) {
    if (!this.data[sensor]) return;
    
    const newValue = this.generateRandomValue(sensor);
    this.data[sensor].current = newValue;
    
    // Add to history
    this.data[sensor].history.push({
      value: newValue,
      timestamp: new Date()
    });
    
    // Keep history at a reasonable size
    if (this.data[sensor].history.length > 100) {
      this.data[sensor].history.shift();
    }
    
    // Check for alerts
    this.checkForAlert(sensor, newValue);
    
    return newValue;
  }
  
  // Refresh all sensors
  refreshAllSensors() {
    ['temperature', 'humidity', 'pressure'].forEach(sensor => {
      this.refreshSensor(sensor);
    });
  }
  
  // Get the current value for a sensor
  getCurrentValue(sensor) {
    return this.data[sensor]?.current || 0;
  }
  
  // Get the status for a sensor based on its current value
  getStatus(sensor, value) {
    const thresholds = this.data[sensor].thresholds;
    
    if (value < thresholds.danger.low || value > thresholds.danger.high) {
      return { label: 'Critical', class: 'danger' };
    } else if (value < thresholds.warning.low || value > thresholds.warning.high) {
      return { label: 'Warning', class: 'warning' };
    } else {
      return { label: 'Normal', class: '' };
    }
  }
  
  // Check if a sensor reading should trigger an alert
  checkForAlert(sensor, value) {
    const thresholds = this.data[sensor].thresholds;
    const sensorName = sensor.charAt(0).toUpperCase() + sensor.slice(1);
    
    if (value < thresholds.danger.low) {
      this.addAlert(`${sensorName} critically low: ${value.toFixed(1)}`, 'danger');
    } else if (value > thresholds.danger.high) {
      this.addAlert(`${sensorName} critically high: ${value.toFixed(1)}`, 'danger');
    } else if (value < thresholds.warning.low) {
      this.addAlert(`${sensorName} below normal: ${value.toFixed(1)}`, 'warning');
    } else if (value > thresholds.warning.high) {
      this.addAlert(`${sensorName} above normal: ${value.toFixed(1)}`, 'warning');
    }
  }
  
  // Add an alert to the alerts list
  addAlert(message, level) {
    const time = new Date().toLocaleTimeString();
    
    this.alerts.unshift({
      message,
      level,
      time
    });
    
    // Keep alerts list at a reasonable size
    if (this.alerts.length > 20) {
      this.alerts.pop();
    }
  }
  
  // Get all alerts
  getAlerts() {
    return this.alerts;
  }
}
