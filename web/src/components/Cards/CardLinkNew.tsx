import React, { useState } from 'react';
import { useParams, Form, useNavigate } from 'react-router-dom';

import { firestore as DB, storage as Bucket } from '../../firebase';
import { collection, doc, arrayUnion, writeBatch, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

import { styled, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const StyledForm = styled(Form)({
  width: "20rem",
  maxWidth: "calc(100vw - 8rem)",
  "> *": {
    margin: "0.25rem 0"
  }
})


function CardLinkNew() {
  const navigate = useNavigate();
  const [openState, updateOpenState] = useState(true);
  const { cardID } = useParams();

  return <Dialog open={openState} onClose={() => navigate("view")}>
    <DialogTitle>Pay it forward</DialogTitle>
    <DialogContent>
      {/* <DialogContentText>
        Send a message to your recipient. Include a photo or short video to make the link more personal!
      </DialogContentText> */}
      <StyledForm method="post" action={`/cards/${cardID}`} encType="multipart/form-data">
        <TextField 
          autoFocus
          id="from"
          name="from"
          type="text"
          fullWidth
          helperText="Your name"
        />
        <TextField 
          autoFocus
          id="recipient"
          name="recipient"
          type="text"
          fullWidth
          helperText="Recipient name"
        />
        <TextField
          multiline
          rows={4}
          autoFocus
          // margin="dense"
          id="message"
          name="message"
          type="text"
          fullWidth
          // variant="standard"
          helperText="Type a message to your recipient"
        />
        {/* <input type="file" /> */}
        <Picker />
        {/* <Input type="file" name="attachment" readOnly placeholder="Max file size is 25 MB" /> */}
        <DialogActions>
          <Button onClick={(e) => navigate("view")}>Cancel</Button>
          {/* <Button type="submit" onClick={e => {navigate("..")}}>Post</Button> */}
          <Button onClick={() => {updateOpenState(false); navigate('view')}} type="submit">Post</Button>
        </DialogActions>
      </StyledForm>
    </DialogContent>
  </Dialog >
}

export default CardLinkNew;
// TODO pagination/subcollectionization
export const cardLinkNewAction = async ({ request, params }: any) => {
  console.log('adding new link')
  const formData = await request.formData();
  console.log(formData)
  const cardID = params.cardID;
  const user = null
  const location = "Toronto, ON" // get location
  // const storageBucketRef = "dummyref" // store file in bucket
  // TODO need to handle file upload failure fastest way is to do it first
  const file = formData.get('attachment');
  const filename = Math.random().toString()
  const storageBucketRef = ref(Bucket, filename)
  await uploadBytes(storageBucketRef, file)
  const cardRef = doc(DB, "cards", cardID);
  const linkRef = doc(collection(DB, "cardLinks"))
  console.log('in function new action')

  // TODO check if card already exists or if it has to be created

  const link: any = {}
  link.cardID = "/cards/" + cardID;
  link.cardRef = cardRef
  link.confirmed = false;
  link.createdAt = location;
  link.createdBy = user ? user.uid : "anonymous";
  link.createdOn = serverTimestamp();
  link.likes = 0;
  link.media = filename;
  link.posterName = user ? user.displayName : formData.get('from')
  link.text = formData.get("message");
  link.recipient = formData.get("recipient")
  link.location = location

  const batch = writeBatch(DB);

  batch.set(linkRef, link);
  batch.update(cardRef, { lastLinkTimestamp: serverTimestamp(), lastLinkRef: linkRef, cardLinks: arrayUnion(linkRef) });

  await batch.commit();
}

// TODO connect file upload
function Picker() {
  return (
  //   <div style={{maxWidth: "calc(100vw - 8rem)", width: "400px", padding: "40px 20px", right: 0, left: 0, background: "#fff", margin: "auto"}} className="container mdl-shadow--6dp">
	// 	<div style={{margin: "0 10px 0 25pxs"}} className="file-upload mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
  //   	<span>BROWSE</span>
  //     	<input type="file" name="FileAttachment" id="FileAttachment" className="upload" style={{position: "absolute",top: 0,right: 0,margin: 0,padding: 0,zIndex: 10,fontSize: "20px",cursor: "pointer",height: "36px",opacity: 0,filter: "alpha(opacity=0)"}} />
  //   </div>
  //   <input type="text" id="fileuploadurl" readOnly placeholder="Maximum file size is 1GB" />
	// </div>
  <Button>
    <span>Upload image or clip</span>
    <input type="file" name="attachment" readOnly placeholder="Maximum file size is 25 MB" style={{width: "100%", display: "inline-block", position: "absolute",top: 0,left: "50%", transform: "translate(50% 50%)" ,margin: 0,padding: 0,zIndex: 10,fontSize: "20px",cursor: "pointer",height: "32px",opacity: 0,filter: "alpha(opacity=0)"}}/>
    {/* <Input type="file" name="attachment" readOnly placeholder="Max file size is 25 MB" /> */}
  </Button>
  );
}

