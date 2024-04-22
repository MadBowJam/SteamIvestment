const renderArrow = (column) => {
  const sortDirection = filteredColumns[column];
  const isFiltered = filteredColumn === column;
  
  // Перевіряємо чи колонка вже фільтрована
  if (isFiltered) {
    // Якщо так, повертаємо ArrowDownwardIcon
    return <ArrowDownwardIcon />;
  }
  
  // Перевіряємо напрям сортування
  if (sortDirection === 'asc') {
    // Якщо сортування в порядку зростання, відображаємо AnimatedArrowUpwardIcon
    return <AnimatedArrowUpwardIcon />;
  } else if (sortDirection === 'desc') {
    // Якщо сортування в порядку спадання, відображаємо AnimatedArrowDownwardIcon
    return <AnimatedArrowDownwardIcon />;
  } else {
    // Якщо напрям сортування не встановлено, або відмічено 'null', повертаємо ArrowDownwardIcon
    return <ArrowDownwardIcon />;
  }
};
