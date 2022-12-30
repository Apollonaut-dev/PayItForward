import * as React from 'react';
import { useLoaderData, Link } from 'react-router-dom';

import { firestore as DB, storage as Bucket } from '../../firebase';
import { collection, query, limit, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

import { Card, CardHeader, CardMedia, CardContent, CardActions, Typography, IconButton, Container, styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';

import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  justifyContet: "center",
  alignItems: "center",
  maxWidth: "calc(100vw - 2rem)",
});

const StyledCard = styled(Card)({
  maxWidth: "calc(100vw - 2rem)",
  width: "24rem",
  margin: "1rem"
})

function CardFeed() {
  const cards = useLoaderData() as any[];

  return (
    <StyledContainer>
      {cards.length ? cards.filter(e => !!e.lastLinkRef).map((e, i) => (
        <StyledCard key={i}>
            <Link style={{ textDecoration: "none" }} to={`/cards/${e.id}`}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "red[500]" }} aria-label="recipe">
                    R
                  </Avatar>
                }
                title="Tony Dee"
                subheader="September 14, 2016"
              />
              {e.lastLink.media ? <CardMedia
                component="img"
                height="194"
                image={e.lastLink.media}
                alt={e.lastLink.media != "dummyref" && e.lastLink.media != "id" ? "a photo of the good deed" : ""}
              /> : null}
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {e.lastLink.text}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  {/* <FavoriteIcon /> */}
                  ☀️
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </CardActions>
            </Link>
        </StyledCard>)) : null}
    </StyledContainer>
  );
}

export default CardFeed;

export const cardsLoader = async () => {
  const cards: any[] = [];
  const promises: any[] = [];
  const collectionRef = collection(DB, 'cards');
  // const q = query(collectionRef, where("lastLinkTimestamp", "!=", null), orderBy('lastLinkTimestamp'), limit(10));
  const q = query(collectionRef, orderBy('lastLinkTimestamp'), limit(10));
  const cardsSnap = await getDocs(q);
  cardsSnap.forEach((c) => {
    const d = c.data();
    if (!d.lastLinkRef) return;
    d.id = c.id
    cards.push(d)
    // if (d.lastLinkRef) {
      const lastLinkRef = doc(DB, 'cardLinks', d.lastLinkRef.id)
      promises.push(getDoc(lastLinkRef))
    // }
  })
  // linkSnaps are in the same order as cardSnaps
  const linkSnaps = await Promise.all(promises)
  const mediaPromises = []
  for (let i = 0; i < cards.length; i++) {
    // if (!linkSnaps[i]) continue;
    cards[i].lastLink = linkSnaps[i].data()
    if (cards[i].lastLink.media && cards[i].lastLink.media != "dummyref" && cards[i].lastLink.media != "id") {
      mediaPromises.push(getDownloadURL(ref(Bucket, cards[i].lastLink.media)))
    } else {
      mediaPromises.push(Promise.resolve())
    }
  }
  const urls = await Promise.all(mediaPromises) 
  for (let i = 0; i < cards.length; i++) {
    if (urls[i]) {
      cards[i].lastLink.media = urls[i]
    }
  }
  return cards;
}