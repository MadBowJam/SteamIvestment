import React from 'react';
import Box from '@mui/material/Box';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const renderArrow = (column, filteredColumns, hoveredColumn, sortedColumn) => {
  const sortDirection = filteredColumns[column];
  const isAscending = sortDirection === 'asc';
  const isVisible = hoveredColumn === column || sortedColumn === column;
  const isFiltered = sortedColumn === column;
  
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

export { renderArrow };