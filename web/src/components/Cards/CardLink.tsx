import * as React from 'react';
import { useLoaderData } from 'react-router-dom';

import { firestore as DB } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

import { Outlet } from 'react-router-dom';

function CardLink() {
  const link = useLoaderData();
  console.log(link);
  return (<div>Card Link 1 <br />{`Link: ${link}`}<Outlet /></div>);
}

export default CardLink;

export const cardLinkLoader = async({ params }: any) => {
  const docRef = doc(DB, "cardLinks", params.cardLinkID);
  const docSnap = await getDoc(docRef);
  const card = docSnap.data();
  return card;
}