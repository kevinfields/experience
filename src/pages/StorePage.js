import React, {useState, useEffect} from 'react';
import Item from '../components/Item';
import LoadingScreen from '../components/LoadingScreen';
import formatCollectionName from '../functions/formatCollectionName';
import '../styling/StorePage.css';

const StorePage = (props) => {


  const [coins, setCoins] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('buy');

  const loadBankData = async () => {

    let ownedItems = [];
    await props.userRef.collection('items').doc('coins').get().then(doc => {
      setCoins(doc.data().amount);
    });

    await props.userRef.collection('items').get().then(snap => {
      snap.forEach(doc => {
        if (doc.id !== 'coins') {
          ownedItems.push({
            item: doc.id,
            amount: doc.data().amount,
            value: doc.data().value,
          })
        }
      })
      setItems(ownedItems);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadBankData();
  }, [])

  return (
    <div className='page'>
      {
        loading ?
          <LoadingScreen />
        : 
          <div className='store-screen'>
            <h3 className='store-header'>Welcome to the General Store</h3>
            <h5 className='money-header'>You have {coins} coins to spend.</h5>
            <div className='buy-sell-prompt'>
              I want to 
              <select className='buy-sell-switch' value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value='buy'>Buy</option>
                <option value='sell'>Sell</option>
              </select>
            </div>
            { mode === 'buy' ?
              <div className='store-wares-screen'>
                Store items go here.
              </div>
            : 
              <div className='bank-items-screen'>
                {items.map(item => (
                  <Item item={formatCollectionName(item.item)} amount={item.amount} value={item.value} />
                ))}
              </div>
            }
          </div>
      }
    </div>
  )
}

export default StorePage