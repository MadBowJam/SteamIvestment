import React from 'react';

const TableRow = ({ item }) => {
  return (
    <tr>
      <td>{item.tournament}</td>
      <td>{item.name}</td>
      <td>{item.price}</td>
      <td>{item.quantity}</td>
      <td>{item.total}</td>
      <td>{item.spend_on_buy}</td>
    </tr>
  );
}

export default TableRow;