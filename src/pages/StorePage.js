import React, {useState, useEffect} from 'react';
import Item from '../components/Item';
import LoadingScreen from '../components/LoadingScreen';
import formatCollectionName from '../functions/formatCollectionName';
import ADD_COINS from '../reducers/ADD_COINS';
import REMOVE_COINS from '../reducers/REMOVE_COINS';
import REMOVE_ITEM from '../reducers/REMOVE_ITEM';
import TAKE_ITEM from '../reducers/TAKE_ITEM';
import '../styling/StorePage.css';

const StorePage = (props) => {


  const [coins, setCoins] = useState(-1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('buy');

  const loadBankData = async () => {

    let ownedItems = [];

    if (coins === -1) {
      await props.userRef.collection('items').doc('coins').get().then(doc => {
        setCoins(doc.data().amount);
      });
    }
  
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

  const buyItem = async (itemObj) => {
    await REMOVE_COINS(props.userRef, itemObj.value).then(res => {
      if (res === 'success') {
        TAKE_ITEM(props.userRef, props.itemsRef, itemObj);
        setCoins(coins - itemObj.value);
      }
    });
    loadBankData();
  };

  const sellItem = async (itemObj, amount) => {

    const price = itemObj.value / itemObj.amount;
    console.log('price: ' + price);
    await REMOVE_ITEM(props.userRef, itemObj, amount).then(res => {
      if (res === 'success') {
        ADD_COINS(props.userRef, Number(price));
        setCoins(Number(coins) + Number(price))
      }
    });
    loadBankData();
  };

  useEffect(() => {
    loadBankData();
  }, []);

  useEffect(() => {
    loadBankData();
  }, [mode])

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
                <div className='store-item'>
                  <Item item='cooking_pan' value={5} />
                  <button 
                    className='buy-item-button'
                    onClick={() => buyItem({
                      name: 'cooking_pan',
                      amount: 1,
                      value: 5,
                    })}>
                      Buy
                  </button> 
                </div>
              </div>
            : 
              <div className='bank-items-screen'>
                {items.map(item => (
                  <div className='store-item'>
                    <Item item={formatCollectionName(item.item)} amount={item.amount} value={item.value} />
                    <button onClick={() => sellItem(item, 1)}>Sell 1</button>
                  </div>
                ))}
              </div>
            }
          </div>
      }
    </div>
  )
}

export default StorePage