import React from 'react';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='Title'>
      <Typography variant="h1" component="h1">
        Steam investments table
      </Typography>
      {/* Посилання на сторінку з графіками */}
      <Link to="/">Go to Main Page</Link>
      <Link to="/chart">Go to Chart Page</Link>
    </div>
  );
}

export default Header;
