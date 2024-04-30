import { market } from 'steam-market-search';

async function searchCSGO(term: string) {
  try {
    const results = await market.searchCSGO(term);
    console.log('Search results:', results);
    return results; // Повертаємо результати пошуку
  } catch (error) {
    console.error('Error searching on Steam Market:', error);
    throw error; // Викидаємо помилку, щоб обробити її на сервері
  }
}

module.exports = {
  searchCSGO // Експортуємо функцію searchCSGO
};
