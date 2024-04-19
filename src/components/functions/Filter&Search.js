import { useMemo, useState } from 'react';

// Функція для фільтрації таблиці
const useTableFilter = (createItemsData) => {
  // Стан для зберігання напрямку сортування
  const [sortDirection, setSortDirection] = useState(null);
  // Стан для зберігання вибраного стовпця сортування
  const [sortedColumn, setSortedColumn] = useState(null);
  // Стан для зберігання значення пошукового терміну
  const [searchTerm, setSearchTerm] = useState('');
  
  // Обробник сортування таблиці за вибраним стовпцем
  const handleSort = (column) => {
    // Перевірка на поточний напрямок сортування
    const isAsc = sortedColumn === column && sortDirection === 'asc';
    // Встановлення нового напрямку сортування
    setSortDirection(isAsc ? 'desc' : 'asc');
    // Встановлення вибраного стовпця сортування
    setSortedColumn(column);
  };
  
  // Обробник зміни значення пошукового терміну
  const handleSearch = (event) => {
    // Встановлення нового значення пошукового терміну
    setSearchTerm(event.target.value);
  };
  
  // Обробник скидання сортування
  const handleResetSorting = () => {
    // Скидання напрямку сортування
    setSortDirection(null);
    // Скидання вибраного стовпця сортування
    setSortedColumn(null);
  };
  
  // Фільтрація даних таблиці з використанням useMemo
  const filteredData = useMemo(() => {
    // Перевірка наявності вибраного стовпця сортування та напрямку
    if (sortedColumn && sortDirection) {
      // Сортування даних за вибраним стовпцем та напрямком
      return createItemsData().sort((a, b) => {
        // Сортування за числовими значеннями від найменшого до найбільшого
        if (['price', 'quantity', 'total', 'spend_on_buy'].includes(sortedColumn)) {
          return sortDirection === 'asc' ? a[sortedColumn] - b[sortedColumn] : b[sortedColumn] - a[sortedColumn];
        } else {
          // Сортування за рядковими значеннями
          return sortDirection === 'asc' ? a[sortedColumn].localeCompare(b[sortedColumn]) : b[sortedColumn].localeCompare(a[sortedColumn]);
        }
      }).filter(item => {
        // Фільтрація даних за введеним пошуковим терміном
        return item.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } else {
      // Фільтрація даних без сортування
      return createItemsData().filter(item => {
        // Фільтрація даних за введеним пошуковим терміном
        return item.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
  }, [sortedColumn, sortDirection, searchTerm, createItemsData]);
  
  // Повернення необхідних значень для використання в компоненті
  return { filteredData, handleResetSorting, handleSearch, handleSort, sortDirection, sortedColumn, searchTerm };
};

export default useTableFilter;