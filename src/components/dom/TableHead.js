import React, { useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { renderArrow } from '../functions/RenderArrow'; // Імпорт функції

const TableHeadComponent = ({ handleSort, sortedColumn }) => {
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [filteredColumn, setFilteredColumn] = useState(null);
  const [filteredColumns, setFilteredColumns] = useState({});
  
  const handleMouseEnter = (column) => {
    setHoveredColumn(column);
  };
  
  const handleMouseLeave = () => {
    setHoveredColumn(null);
  };
  
  const handleSortAndUpdate = (column) => {
    const currentSortDirection = filteredColumns[column];
    
    // Скидання стану фільтрації попереднього стовбця
    if (filteredColumn && filteredColumn !== column) {
      setFilteredColumns((prev) => ({
        ...prev,
        [filteredColumn]: null,
      }));
    }
    
    handleSort(column);
    setFilteredColumn(column);
    const nextSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    
    setFilteredColumns((prev) => ({
      ...prev,
      [column]: nextSortDirection,
    }));
  };
  
  const columns = [
    'tournament',
    'name',
    'price',
    'quantity',
    'total',
    'spendOnBuy'
  ];
  
  return (
    <TableRow className="TableHead">
      {columns.map((column) => (
        <TableCell
          key={column}
          onClick={() => handleSortAndUpdate(column)}
          onMouseEnter={() => handleMouseEnter(column)}
          onMouseLeave={handleMouseLeave}
        >
          {(column.charAt(0).toUpperCase() + column.slice(1)).replace(/[^A-Z0-9]/ig, " ")}
          {renderArrow(column, filteredColumns, hoveredColumn, sortedColumn)}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableHeadComponent;