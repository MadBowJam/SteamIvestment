import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='Title'>
      <Link to="/">Steam investments table</Link>
      <br/>
      <Link to="/chart">Chart Page</Link>
    </div>
  );
}

export default Header;
