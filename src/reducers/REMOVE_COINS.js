export default async function REMOVE_COINS(userRef, amount) {

  let current;
  await userRef.collection('items').doc('coins').get().then(doc => {
    current = doc.data().amount;
  });

  if (amount > current) {
    return 'You do not have enough coins!';
  }

  let newAmount = current - amount;

  userRef.collection('items').doc('coins').set({
    amount: newAmount,
    value: newAmount,
  });

  return 'success';
}