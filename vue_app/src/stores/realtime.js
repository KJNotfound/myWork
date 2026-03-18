import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRealTimeStore = defineStore('realTime', () => {
  const energyData = ref({
    time: [],
    value: []
  });

  const tempData = ref({
    time: [],
    target: [],
    actual: [],
    return: []
  });

  const roomData = ref([21.5, 22.8, 22.1]);
  
  const radarData = ref([85, 88, 75, 80, 92]);

  const updateEnergy = (time, value) => {
    energyData.value.time.push(time);
    energyData.value.value.push(value);
    if (energyData.value.time.length > 20) {
      energyData.value.time.shift();
      energyData.value.value.shift();
    }
  };

  const updateTemp = (time, target, actual, returnVal) => {
    tempData.value.time.push(time);
    tempData.value.target.push(target);
    tempData.value.actual.push(actual);
    tempData.value.return.push(returnVal);
    if (tempData.value.time.length > 20) {
      tempData.value.time.shift();
      tempData.value.target.shift();
      tempData.value.actual.shift();
      tempData.value.return.shift();
    }
  };

  const startSimulation = () => {
    setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();

      // Simulate energy data
      const energyVal = Math.floor(Math.random() * 50 + 100);
      updateEnergy(timeStr, energyVal);

      // Simulate temperature data
      const target = 50;
      const actual = parseFloat((target + (Math.random() - 0.4) * 1.5).toFixed(2));
      const returnVal = parseFloat((target - 8 + (Math.random() - 0.5) * 1).toFixed(2));
      updateTemp(timeStr, target, actual, returnVal);

      // Simulate room data
      roomData.value = roomData.value.map(v => parseFloat((v + (Math.random() - 0.5) * 0.2).toFixed(1)));

      // Simulate radar data
      radarData.value = [
        80 + Math.random() * 15,
        85 + Math.random() * 10,
        70 + Math.random() * 15,
        75 + Math.random() * 10,
        90 + Math.random() * 5
      ];
    }, 3000);
  };

  return {
    energyData,
    tempData,
    roomData,
    radarData,
    startSimulation
  };
});
