import * as React from 'react';

import { Form, useNavigate } from 'react-router-dom';

import { Container } from '@mui/material';


// TODO should not create cards here, this is just a scanner page
function Scanner() {
  const navigate = useNavigate();

  async function handleScan(e: any) {
    e.preventDefault();
    console.log(e.target.elements.cardID.value)
    setTimeout(() => {
      navigate("/cards/" + e.target.elements.cardID.value + "/new")
    }, 500)
  }

  return <Container>
    <Form style={{ display: "flex", flexDirection: "column" }} method="get" onSubmit={handleScan}>
      <label>Card ID</label><input name="cardID" />
      <button type="submit">Submit</button>
      {/* <input name="img" type="file" accept="image/*" capture="environment"></input> */}
      <input type="file" accept="image/*" capture></input>
    </Form>
  </Container>;
}

export default Scanner;
