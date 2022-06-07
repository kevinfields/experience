import React, {useState, useEffect} from 'react';
import '../styling/BankPage.css';
import Item from '../components/Item';
import LoadingScreen from '../components/LoadingScreen';
import formatCollectionName from '../functions/formatCollectionName';

const BankPage = (props) => {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
  
    let itemCatcher = [];

    await props.userRef.collection('items').get().then(snap => {
      snap.forEach(doc => {
        itemCatcher.push({
          item: doc.id,
          amount: doc.data().amount,
          value: doc.data().value,
        })
      })
    setItems(itemCatcher);
    setLoading(false);
    });
  }

  useEffect(() => {
    loadItems();
  }, [])

  return (
    <div className='page'>
      {loading ? 
        <LoadingScreen /> 
      :
      <div className='bank-screen'>
        <h3 className='bank-header'>My Bank</h3>
        <div className='item-list'>
          {items.map(item => (
            <Item item={formatCollectionName(item.item)} amount={item.amount} value={item.value} />
          ))}
        </div>
      </div>
      }
    </div>
  )
}

export default BankPage