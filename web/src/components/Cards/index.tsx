import * as React from 'react';
import QRCode from "react-qr-code";

import { Outlet } from 'react-router-dom';

function Cards() {
  return (
    <>
      {/* <div>
        <QRCode 
          value={'hello'}
        />
      </div> */}
      <Outlet />
    </>
  );
}

export default Cards;