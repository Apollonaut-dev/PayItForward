import * as React from 'react';
import { Navigate } from 'react-router-dom';

function Home() {
  return (<Navigate to="/cards"/>);
}

export default Home;