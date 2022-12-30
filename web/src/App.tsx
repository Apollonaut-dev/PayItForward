import React, { useEffect } from 'react';
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Layout from './components/Layout';
import Home from './components/Home';
import Cards from './components/Cards';
import CardFeed, { cardsLoader } from './components/Cards/CardFeed';
import Card, { cardLoader } from './components/Cards/Card';
// import CardComments from './components/Cards/CardComments';
// import CardCommentsNew from './components/Cards/CardCommentsNew';
// import CardLink, { cardLinkLoader } from './components/Cards/CardLink';
import CardLinkNew, { cardLinkNewAction } from './components/Cards/CardLinkNew';
// import CardLinkComments from './components/Cards/CardLinkComments';
// import CardLinkCommentsNew from './components/Cards/CardLinkCommentsNew';

import Scan from './components/Scan';
import Scanner from './components/Scan/Scanner';

import { createNewCard, readOneCardById } from './firebase/api/cards';

import { firestore as DB, storage as Bucket } from './firebase';
import { collection, query, limit, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

// TODO Error routing
// TODO database refactoring
// TODO database rules
// TODO Auth flow
// TODO photo/video uploading via Storage
// TODO QR Code/Camera API
// TODO styling needs a complete rework (e.g. using flex for layout, and for page rather than just content within feed component), preferably by someone who knows what they're doing with CSS. I hate this shit
// TODO https://mui.com/material-ui/react-app-bar/
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}
// export const themeOptions: ThemeOptions = {
export const themeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#faaf4c',
    },
    secondary: {
      main: '#4c97fa',
    },
    success: {
      main: '#97fa4c',
    },
    info: {
      main: '#4cfaaf',
    },
    error: {
      main: '#fa584c',
    },
    warning: {
      main: '#eefa4c',
    },
  },
};

const theme = createTheme(themeOptions)

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Layout />}>
      <Route
        index
        element={<Home />} />
      <Route
        path="cards"
        element={<Cards />}>
        <Route
          index
          loader={cardsLoader}
          element={<CardFeed />} />
        <Route
          path=":cardID"
          loader={cardLoader}
          action={cardLinkNewAction}
          element={<Card />}>
          <Route
            // path="new" 
            index
            element={<CardLinkNew />} />
          <Route
            path="view"
            element={<Card />}
            loader={cardLoader}
          />
          {/* // TODO cardLinks should each have their own page with comments*/}
          {/* <Route loader={cardLinkLoader} path=":cardLinkID" element={<CardLink />}> */}
          {/* <Route path="comments" element={<CardLinkComments />}>
              <Route path="new" element={<CardLinkCommentsNew />} />
            </Route> */}
          {/* </Route> */}
          {/* <Route pat
          h="comments" element={<CardComments />}>
            <Route path="new" element={<CardCommentsNew />} />
          </Route> */}
        </Route>
      </Route>
      <Route
        path="scan"
        element={<Scan />}>
        <Route
          index element={<Scanner />} />
      </Route>
      <Route
        path="*"
        element={<div>404</div>} />
    </Route>
  )
)

async function getCards() {
  console.log('getting cards...')
  const collectionRef = collection(DB, 'cards');
  const q = query(collectionRef, orderBy('lastLinkTimestamp'), limit(10));
  const cardsSnap = getDocs(q);
  return cardsSnap
}

function App() {
  // just for testing
  // useEffect(() => {
  //   const collectionRef = collection(DB, 'cards');
  //   const q = query(collectionRef, orderBy('lastLinkTimestamp'), limit(10));
  //   const cardsSnap = await getDocs(q);
  // }, [])
  getCards().then((cs) => {
    cs.forEach(c => {
      console.log(c.data())
    })
  })
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
