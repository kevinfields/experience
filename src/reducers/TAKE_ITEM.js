
export default async function TAKE_ITEM(userRef, itemObject) {


 
  let value = itemObject.value;
  value = value * itemObject.amount;

  await userRef.collection('items').doc(itemObject.item).get().then(doc => {
    if (doc.data() === undefined) {
      userRef.collection('items').doc(itemObject.item).set({
        amount: itemObject.amount,
        value: value,
      })
    } else {
      addItems(itemObject);
    }
  })

  async function addItems(obj) {

    let currentVals;

    await userRef.collection('items').doc(obj.item).get().then(doc => {
      currentVals = {
        value: doc.data().value,
        amount: doc.data().amount,
      }
    });

    userRef.collection('items').doc(obj.item).set({
      value: Number(currentVals.value) + Number(value),
      amount: Number(currentVals.amount) + Number(obj.amount),
    })
  }
}