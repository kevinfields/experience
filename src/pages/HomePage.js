import React, {useState, useEffect} from 'react'
import LevelDisplay from '../components/LevelDisplay';
import LoadingScreen from '../components/LoadingScreen';
import TAKE_ITEM from '../reducers/TAKE_ITEM';
import '../styling/HomePage.css';

const HomePage = (props) => {

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {

    await props.userRef.get().then(doc => {
      setUserData(doc.data());
      setLoading(false);
    })
  }

  useEffect(() => {
    loadUserData();
  }, [])


  return (
    <div className='page'>
      {loading ? 
        <LoadingScreen />
      : <div className='user-info'>
          <h3 className='user-info-header'>
            Welcome, {userData.username}!
          </h3>
          <div className='level-display-list'>
            <div className='stats-header'>My Stats: </div>
            <LevelDisplay skill='Construction' xp={userData.constructionXp} />
            <LevelDisplay skill='Cooking' xp={userData.cookingXp} />
            <LevelDisplay skill='Crafting' xp={userData.craftingXp} />
            <LevelDisplay skill='Farming' xp={userData.farmingXp} />
            <LevelDisplay skill='Fitness' xp={userData.fitnessXp} />
            <LevelDisplay skill='Hunting' xp={userData.huntingXp} />
            <LevelDisplay skill='Medicine' xp={userData.medicineXp} />
          </div>
        </div>
      }
    </div>
  )
}

export default HomePage