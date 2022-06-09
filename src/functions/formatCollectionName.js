export default function formatCollectionName(name) {

  let nameArr = name.split('');

  for (let i=0; i<nameArr.length; i++) {
    if (nameArr[i] === '_') {
      nameArr[i] = ' ';
    }
  }

  nameArr[0] = nameArr[0].toUpperCase();
  return nameArr.join('');
}