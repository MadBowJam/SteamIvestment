const axios = require('axios');
const fs = require('fs');

const fetchNBUData = async () => {
  try {
    const response = await axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    return response.data;
  } catch (error) {
    console.error('Error fetching NBU data:', error);
    return null;
  }
};

const filterDesiredCurrencies = (data) => {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data format');
    return [];
  }
  
  const desiredCurrencies = ['Долар США'];
  
  return data.filter(item => desiredCurrencies.includes(item.txt));
};

const saveFilteredDataToFile = async () => {
  const data = await fetchNBUData();
  const filteredData = filterDesiredCurrencies(data);
  
  if (filteredData.length > 0) {
    try {
      fs.writeFileSync('../NBU.json', JSON.stringify(filteredData, null, 2));
      console.log('Filtered NBU data saved to NBU.json');
    } catch (error) {
      console.error('Error saving filtered NBU data to file:', error);
    }
  } else {
    console.error('No desired data found in NBU');
  }
};

// Викликаємо функцію для фільтрації та збереження даних у файл
saveFilteredDataToFile();
