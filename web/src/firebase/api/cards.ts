import { firestore as DB } from '../index'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

const user = {
  displayName: "tony",
}

export async function readOneCardById(uid, populateLast10Links?: boolean) {
  const cardRef = doc(DB, "cards", uid)
  const cardSnap = await getDoc(cardRef)
  const cardData = cardSnap.data()
  if (cardData.lastLinkRef) {
    const lastLink = (await getDoc(cardData.lastLinkRef)).data()
    cardData.lastLink = lastLink
  }
  // TODO subcollectionization
  if (populateLast10Links) {
    // cardData.links = (await getDocs(cardRef, 'cardLinks', orderBy('timestamp'), limit(10))).data()
    cardData.links = (await Promise.all(cardData.cardLinks.map((l: any) => getDoc(l)))).map(l => l.data()).reverse();
  }
  return cardData
}

export async function createNewCard(uid) {
  if (!uid) throw Error("tried to create new card without uid")
  const cardRef = doc(DB, "cards", uid)
  let location = "Toronto" // for now. TODO use geolocation API, Promisify it, use it to lookup text based location

  return setDoc(cardRef, {
    createdBy: user.displayName,
    createdAt: location,
    createdOn: serverTimestamp(),
    lastLinkRef: null,
    lastLinkTimestamp: null,
    cardLinks: []
  })
}

export function createCardLink() {

}

// export const cardLinkNewAction = async ({ request, params }: any) => {
//   console.log('adding new link')
//   const formData = await request.formData();
//   const cardID = params.cardID;
//   const user = { uid: "abc123", givenName: "Alice", surname: "Bob" } // get user
//   const location = "London, ON" // get location
//   const storageBucketRef = "dummyref" // store file in bucket

//   const cardRef = doc(DB, "cards", cardID);
//   const linkRef = doc(collection(DB, "cardLinks"))
//   console.log('in function new action')

//   // TODO check if card already exists or if it has to be created

//   const link: any = {}
//   link.cardID = "/cards/" + cardID;
//   link.cardRef = cardRef
//   link.confirmed = false;
//   link.createdAt = location;
//   link.createdBy = user.uid;
//   // link.createdOn = Timestamp.fromDate(new Date());
//   link.createdOn = serverTimestamp();
//   link.likes = 0;
//   link.media = storageBucketRef;
//   link.posterName = user.givenName + " " + user.surname;
//   link.text = formData.get("message");

//   const batch = writeBatch(DB);

//   batch.set(linkRef, link);
//   batch.update(cardRef, { lastLinkTimestamp: serverTimestamp(), lastLinkRef: linkRef, cardLinks: arrayUnion(linkRef) });

//   await batch.commit();
// }