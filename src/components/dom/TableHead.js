import React, { useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import Box from '@mui/material/Box';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const TableHeadComponent = ({ handleSort, sortedColumn, sortDirection }) => {
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
  
  const renderArrow = (column) => {
    const sortDirection = filteredColumns[column];
    const isAscending = sortDirection === 'asc';
    const isVisible = hoveredColumn === column || sortedColumn === column;
    const isFiltered = filteredColumn === column;
    
    return (
      <Box
        component="span"
        sx={{
          marginLeft: 1,
          visibility: isVisible ? 'visible' : 'hidden',
          opacity: isFiltered ? 1 : 0.5,
          transition: 'opacity 0.3s ease',
        }}
      >
        {sortDirection ? (
          isAscending ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />
        ) : (
          <ArrowDownwardIcon />
        )}
      </Box>
    );
  };
  
  const columns = [
    'tournament',
    'name',
    'price',
    'quantity',
    'total',
    'spend_on_buy'
  ];
  
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column}
          onClick={() => handleSortAndUpdate(column)}
          onMouseEnter={() => handleMouseEnter(column)}
          onMouseLeave={handleMouseLeave}
        >
          {(column.charAt(0).toUpperCase() + column.slice(1)).replace(/[^A-Z0-9]/ig, " ")}
          {renderArrow(column)}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableHeadComponent;