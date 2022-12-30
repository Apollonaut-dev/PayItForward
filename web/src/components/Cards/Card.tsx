import React, { useEffect, useState } from 'react';
import { useLoaderData, Outlet, Await } from 'react-router-dom';

import { firestore as DB, storage as Bucket } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

import Avatar from '@mui/material/Avatar';

import { Skeleton, Badge, Card as MUICard, CardHeader, CardMedia, CardContent, CardActions, Typography, IconButton, Container, styled } from '@mui/material';

import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LinkIcon from '@mui/icons-material/Link';

// TODO typing
// import { DBItem } from '../../types';
// interface Card extends DBItem { }

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "calc(100vw - 2rem)",
});

const StyledCard = styled(MUICard)({
  maxWidth: "calc(100vw - 2rem)",
  width: "24rem",
  margin: "1rem 0"
});

const StyledLinkIcon = styled(LinkIcon)({
  transform: "rotate(-90deg)"
});

// function useUpdate() {
//   const [state, updateState] = useState(0)
//   return () => updateState(state + 1)
// }

// TODO replace placeholder text/media with card/link/user text/media
function Card() {
  const card: any = useLoaderData();
  const [cardState, updateCardState] = useState(card);

  // const update = useUpdate();

  // TODO need to find a better way of syncing UI and DB state when like or share button is pressed
  // TODO likes need to be an array of references
  return (
    <StyledContainer>
      <React.Suspense fallback={<Skeleton variant="rounded" />}>
        <Await
          resolve={card}
          errorElement={
            <div>Could not load card 😬</div>
          }
          children={(cardState: any) => (
            <>
              {cardState.links && cardState.links.map((e: any, i: number) => (
                <React.Fragment key={i}>
                  <StyledCard>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: "red[500]" }} aria-label="recipe">
                          R
                        </Avatar>
                      }
                      title={e.posterName}
                      subheader={`Posted on ${new Date(e.createdOn.seconds * 1000).toDateString()} by ${e.posterName} for ${e.recipient ? e.recipient : "unknown"} ${e.location ? "in" + e.location : ""}`}
                    />
                    {e.media && e.media != "dummyref" ? <CardMedia
                      component="img"
                      height="194"
                      image={e.media ? e.media : ""}
                      alt={!e.media ? "a photo of the good deed" : ""}
                    /> : null}
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {e.text}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton
                        onClick={() => {
                          e.shares += 1;
                          // update();
                          updateCardState(() => {
                            const updatedState = {
                              ...cardState,
                              links: [...cardState.links]
                            }
                            updatedState.links[i].liked = !updatedState.links[i].liked
                            if (updatedState.links[i].liked) {
                              // TODO add one like to DB
                            } else {
                              // TODO remove one like from DB
                            }
                            console.log(updatedState) 
                            return updatedState
                          })
                        }} aria-label="add to favorites">
                        <Badge badgeContent={e.liked ? e.likes + 1 : e.likes} color="secondary">
                          {/* <FavoriteIcon /> */}
                          ☀️
                        </Badge>
                      </IconButton>
                      <IconButton aria-label="share">
                        <Badge badgeContent={e.shares ? e.shares : 0} color="secondary">
                          <ShareIcon />
                        </Badge>
                      </IconButton>
                    </CardActions>
                  </StyledCard>
                  {i < cardState.links.length - 1 ? <StyledLinkIcon /> : null}
                </React.Fragment>
              ))}
            </>
          )}
        />
      </React.Suspense>
      <Outlet />
    </StyledContainer>);
}

export default Card;

export const cardLoader = async ({ params }: any) => {
  const cardRef = doc(DB, "cards", params.cardID);
  const cardSnap = await getDoc(cardRef);
  let card: any;
  if (!cardSnap.exists()) {
    await setDoc(cardRef, {
      createdAt: "placeholder location",
      createdBy: "admin",
      createdOn: serverTimestamp(),
      lastLinkRef: null,
      lastLinkTimestamp: null,
      cardLinks: []
    })
    const newSnap = await getDoc(cardRef)
    card = newSnap.data()
  } else {
    card = cardSnap.data()
  }

  if (card.lastLinkRef && card.cardLinks && card.cardLinks.length > 0) {
    const lastLinkSnap = await getDoc(card.lastLinkRef)
    card.lastLink = lastLinkSnap.data()
    card.links = (await Promise.all(card.cardLinks.map((l: any) => getDoc(l)))).map(l => {
      return {
        ...l.data(),
        id: l.uid,
        // liked: l.likes.includes(/* user id */) ? true : false
        liked: false
      }
    }
    ).reverse();
    const mediaPromises = []
    for (let i = 0; i < card.links.length; i++) {
      const l = card.links[i]
      if (l.media) {
        if (l.media != "dummyref") {
          mediaPromises.push(getDownloadURL(ref(Bucket, l.media)))
        } else {
          mediaPromises.push(Promise.resolve())
        }
      }
    }  
    const urls = await Promise.all(mediaPromises)
    for (let i = 0; i < card.links.length; i++) {
      if (urls[i]){
        card.links[i].media = urls[i]
      }
    }  
  }

  

  return card;
}