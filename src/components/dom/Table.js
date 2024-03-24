import React from 'react';
import TableRow from './TableRow';

const Table = ({ data }) => {
  return (
    <table>
      <thead>
      <tr>
        <th>tournament</th>
        <th>name</th>
        <th>price</th>
        <th>quantity</th>
        <th>total</th>
        <th>spend on buy</th>
      </tr>
      </thead>
      <tbody>
      {data.map((item, index) => (
        <TableRow key={index} item={item} />
      ))}
      </tbody>
    </table>
  );
}

export default Table;
