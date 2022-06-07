
   
export default async function ADD_SIGN_IN(userRef, timestamp) {

  let data;
  await userRef.get().then(doc => {
    data = doc.data();
  });

  userRef.set({
    ...data,
    lastLogin: timestamp,
  })
}