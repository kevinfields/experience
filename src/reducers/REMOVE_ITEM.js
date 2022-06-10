export default async function REMOVE_ITEM(userRef, item, number) {

  let userItemValue;
  let totalValue;
  let singleValue;

  await userRef.collection('items').doc(item).get().then(doc => {
    totalValue = doc.data().value;
    userItemValue = doc.data().amount;
    singleValue = (totalValue / userItemValue);
  })


  let newAmount = userItemValue - number;
  if (newAmount < 0) {
    return ('You do not own that many of this item.');
  }

  if (newAmount > 0) {
    userRef.collection('items').doc(item).set({
      amount: newAmount,
      value: (singleValue * newAmount),
    })
  }

  if (newAmount === 0) {
    userRef.collection('items').doc(item).delete();
  }
  return 'success';
}