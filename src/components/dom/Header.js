import React from 'react';
import Typography from '@mui/material/Typography';
import '../../font/RobotoFlex.ttf';

const Header = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h1" component="h1" gutterBottom style={{ fontSize: '2rem' }}>
        Steam investments table
      </Typography>
    </div>
  );
}

export default Header;
