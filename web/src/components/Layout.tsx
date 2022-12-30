import * as React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';

// assets
import logo from '../hflogo.png'

import { styled, Container, AppBar, Toolbar, ToggleButtonGroup, ToggleButton, Box, IconButton, Avatar } from '@mui/material';

import CameraIcon from '@mui/icons-material/CameraAltOutlined';
import ViewDayOutlinedIcon from '@mui/icons-material/ViewDayOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  position: "absolute",
  left: "50%",
  transform: "translate(-50%)",
  display: "flex",
  "> *": {
    width: "25vw",
    maxWidth: "8rem"
  }
});

const StyledLink = styled(Link)({
  width: "100%",
  height: "100%"
})

const TopLevelNavMap: any = {
  1: '/',
  2: '/cards',
  3: '/scan',
  4: '/account'
}

const TopLevelMapNav: any = {
  '/': 1,
  '/cards': 2,
  '/scan': 3,
  '/account': 4
}
// TODO fix tab state logic: set tab state on render according to URL
function Layout() {
  const location = useLocation()
  // TODO this seems inefficient -- maybe solution is useEffect with useState
  let toplevel = location.pathname.split('/')[1]
  // useEffect(() => {
  //   toplevel = location.pathname.split('/')[1]
  // }, [location])
  let navState;
  switch (toplevel) {
    case TopLevelMapNav[0]:
      navState = 0
      break;
    case TopLevelMapNav[0]:
      navState = 1
      break;
    case TopLevelMapNav[0]:
      navState = 2
      break;
    case TopLevelMapNav[0]:
      navState = 3
      break;
  }
  // TODO the fucking CSS needs a rework. Should be possible to do sticky top and bottom bars without manually adding margins to outlet container
  // this whole layout thing needs a complete fucking rework
  return (
    <Container style={{ display: "block", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", minWidth: "100%", minHeight: "100vh", margin: "0", padding: 0 }}>
      <AppBar color="primary" style={{ display: "flex", justifyContent: "space-between", alignContent: "center", alignItems:"center", flexDirection: "row", position: "relative", padding: "2px", textAlign: "center" }}>
        {/* <Typography> */}
        <div></div>
        <IconButton style={{justifySelf: "center"}}>
          <img alt="logo" style={{ backgroundColor: "none", maxWidth: "4rem", margin: "0 auto", display: "inline-block" }} src={logo} />
        </IconButton>
        {/* </Typography> */}
        {/* <Box style={{alignSelf: "flex-end"}}> */}
          <IconButton style={{justifySelf: "flex-end"}}>
            <Avatar alt="my profile pic">👨</Avatar>
          </IconButton>
        {/* </Box> */}
      </AppBar>
      <Container style={{ margin: "0 auto", marginBottom: "3rem", padding: "1rem", width: "100%" }}>
        <Outlet />
      </Container>
      <AppBar style={{ position: "fixed", top: "auto", bottom: "0", alignSelf: "flex-end" }}>
        <Toolbar>
          <StyledToggleButtonGroup value={navState} exclusive aria-label="navigation">
            <ToggleButton value={1}>
              <StyledLink to={TopLevelNavMap[1]}>
                <HomeOutlinedIcon />
              </StyledLink>
            </ToggleButton>
            <ToggleButton value={2}>
              <StyledLink to={TopLevelNavMap[2]}>
                <ViewDayOutlinedIcon />
              </StyledLink>
            </ToggleButton>
            <ToggleButton value={3}>
              <StyledLink to={TopLevelNavMap[3]}>
                <CameraIcon />
              </StyledLink>
            </ToggleButton>
            <ToggleButton value={4}>
              <StyledLink to={TopLevelNavMap[4]}>
                <AccountCircleOutlinedIcon />
              </StyledLink>
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Toolbar>
      </AppBar>
    </Container>
  )
}

export default Layout;