export default async function ADD_COINS(userRef, amount) {
  let current;

  await userRef.collection('items').doc('coins').get().then(doc => {
    current = doc.data().amount;
  });


  userRef.collection('items').doc('coins').set({
    amount: current + amount,
    value: current + amount,
  });
}