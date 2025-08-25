import { useMemo, useState } from 'react';

const useTableFilter = (createItemsData) => {
  const [sortDirection, setSortDirection] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [arrowRotation, setArrowRotation] = useState(0);
  const [selected, setSelected] = useState([]);
  
  const handleSort = (column) => {
    const isAsc = sortedColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortedColumn(column);
    setArrowRotation(isAsc ? 180 : 0);
  };
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = createItemsData().map((item) => item.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };
  
  const isSelected = (name) => selected.indexOf(name) !== -1;
  
  const filteredData = useMemo(() => {
    if (sortedColumn && sortDirection) {
      return createItemsData()
        .sort((a, b) => {
          if (['price', 'quantity', 'total', 'spendOnBuy'].includes(sortedColumn)) {
            return sortDirection === 'asc' ? a[sortedColumn] - b[sortedColumn] : b[sortedColumn] - a[sortedColumn];
          } else {
            return sortDirection === 'asc' ? a[sortedColumn].localeCompare(b[sortedColumn]) : b[sortedColumn].localeCompare(a[sortedColumn]);
          }
        })
        .filter(item => {
          return item.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    } else {
      return createItemsData().filter(item => {
        return item.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
  }, [sortedColumn, sortDirection, searchTerm, createItemsData]);
  
  return { filteredData, handleSearch, handleSort, arrowRotation, selected, handleSelectAllClick, handleClick, isSelected };
};

export default useTableFilter;