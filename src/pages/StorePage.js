import React, {useState, useEffect} from 'react';
import Item from '../components/Item';
import LoadingScreen from '../components/LoadingScreen';
import StoreItem from '../components/StoreItem';
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
        TAKE_ITEM(props.userRef, itemObj);
        setCoins(coins - itemObj.value);
      }
    });
    // it might be easier to just loadBankData() here but that seems unneccessary if 
    // I can update the state directly.

    let owned = false;
    let amount = 0;

    for (const sg of items) {
      if (sg.item === itemObj.item) {
        owned = true;
        amount = sg.amount;
      }
    }

    if (owned) {
      const newData = {
        item: itemObj.item,
        amount: amount + 1,
        value: itemObj.value * (Number(amount) + 1),
      };
      let itemCatcher = items.filter(item => item.item !== itemObj.item);
      itemCatcher.push(newData);
      setItems(itemCatcher);
    } else {

      const newData = {
        item: itemObj.item,
        amount: 1,
        value: itemObj.value,
      }
      let itemCatcher = [...items];
      itemCatcher.push(newData);
      setItems(itemCatcher);
    }
  };

  const sellItem = async (itemObj, amount) => {

    if (amount === itemObj.amount) {
      if (!window.confirm('Are you sure you want to sell every one of this item?')) {
        return;
      }
    }

    const price = itemObj.value / itemObj.amount;
    await REMOVE_ITEM(props.userRef, itemObj.item, amount).then(res => {
      if (res === 'success') {
        ADD_COINS(props.userRef, Number(price * amount));
        setCoins(Number(coins) + Number(price * amount))
      }
    });
    
    let itemsCatcher = [...items];
    for (const sg of itemsCatcher) {
      if (sg.item === itemObj.item) {
        sg.amount = sg.amount - amount;
        sg.value = sg.value - (price * amount)
      }
    }
    itemsCatcher = itemsCatcher.filter(item => item.amount > 0);
    setItems(itemsCatcher); 
  };

  useEffect(() => {
    loadBankData();
  }, []);


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
              <StoreItem 
                buyItem={(obj) => buyItem(obj)}
                item={'cooking_pan'}
                value={5} 
              />
              <StoreItem 
                buyItem={(obj) => buyItem(obj)}
                item={'carrot_seed'}
                value={2} 
              />
              <StoreItem
                buyItem={(obj) => buyItem(obj)}
                item={'hunting_bow'}
                value={50}
              />
              <StoreItem
                buyItem={(obj) => buyItem(obj)}
                item={'arrows'}
                value={3}
              />
              <StoreItem
                buyItem={(obj) => buyItem(obj)}
                item={'axe'}
                value={40}
              />
              <StoreItem
                buyItem={(obj) => buyItem(obj)}
                item={'bread_dough'}
                value={5}
              />
              <StoreItem
                buyItem={(obj) => buyItem(obj)}
                item={'nails'}
                value={2}
              />
              <StoreItem
                buyItem={(obj) => buyItem(obj)}
                item={'hammer'}
                value={15}
              />
              <StoreItem
                buyItem={(obj) => buyItem(obj)}
                item={'acetaminophen'}
                value={25}
              />
              <StoreItem
                buyItem={(obj) => buyItem(obj)}
                item={'lemon'}
                value={5}
              />
              <StoreItem
                buyItem={(obj) => buyItem(obj)}
                item={"lemon_seed"}
                value={3}
              />
              <StoreItem
                buyItem={(obj) => buyItem(obj)}
                item={'fishing_pole'}
                value={100}
              />
              </div>
            : 
              <div className='bank-items-screen'>
                {items.map(item => (
                  <div className='store-item'>
                    <Item item={formatCollectionName(item.item)} amount={item.amount} value={item.value} />
                    <button className='sell-item-button' onClick={() => sellItem(item, 1)}>Sell 1</button>
                    <button className='sell-half-button' onClick={() => sellItem(item, Math.floor(item.amount / 2))}>Sell Half</button>
                    <button className='sell-all-button' onClick={() => sellItem(item, item.amount)}>Sell All</button>
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