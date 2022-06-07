
export default async function TAKE_ITEM(userRef, itemsRef, itemObject) {

  let value;
  await itemsRef.doc(itemObject.name).get().then(doc => {
    value = doc.data().value;
  })

  value = value * itemObject.amount;

  await userRef.collection('items').doc(itemObject.name).get().then(doc => {
    if (doc.data() === undefined) {
      userRef.collection('items').doc(itemObject.name).set({
        amount: itemObject.amount,
        value: value,
      })
    } else {
      addItems(itemObject);
    }
  })

  async function addItems(obj) {

    let currentVals;

    await userRef.collection('items').doc(obj.name).get().then(doc => {
      currentVals = {
        value: doc.data().value,
        amount: doc.data().amount,
      }
    });

    userRef.collection('items').doc(obj.name).set({
      value: Number(currentVals.value) + Number(value),
      amount: Number(currentVals.amount) + Number(obj.amount),
    })
  }
}