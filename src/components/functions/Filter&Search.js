import { useMemo, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const useTableFilter = (createItemsData) => {
  const [sortDirection, setSortDirection] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSort = (column) => {
    const isAsc = sortedColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortedColumn(column);
  };
  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const [resetIcon, setResetIcon] = useState(<KeyboardArrowRightIcon />);
  
  const handleResetSorting = () => {
    setSortDirection(null);
    setSortedColumn(null);
    setResetIcon(<KeyboardArrowRightIcon />);
  };
  
  const filteredData = useMemo(() => {
    if (sortedColumn && sortDirection) {
      return createItemsData()
        .sort((a, b) => {
          if (['price', 'quantity', 'total', 'spend_on_buy'].includes(sortedColumn)) {
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
  
  return { filteredData, handleResetSorting, handleSearch, handleSort };
};

export default useTableFilter;