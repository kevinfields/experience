export default async function REMOVE_ITEM(userRef, itemObject, number) {

  let userItemValue = itemObject.amount;
  let totalValue;
  let singleValue;

  await userRef.collection('items').doc(itemObject.item).get().then(doc => {
    totalValue = doc.data().value;
    singleValue = (totalValue / userItemValue)
  })


  let newAmount = userItemValue - number;

  if (newAmount < 0) {
    return ('You do not own that many of this item.');
  }

  if (newAmount > 0) {
    userRef.collection('items').doc(itemObject.item).set({
      amount: newAmount,
      value: (singleValue * newAmount),
    })
  }

  if (newAmount === 0) {
    userRef.collection('items').doc(itemObject.item).delete();
  }
  return 'success';
}