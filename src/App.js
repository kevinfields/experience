import {Routes, Route, useNavigate, Link} from 'react-router-dom';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BankPage from './pages/BankPage';
import StorePage from './pages/StorePage';
import OutsidePage from './pages/OutsidePage';
import LogoutPage from './pages/LogoutPage';
import { useEffect, useState } from 'react';
import CreateAccountPage from './pages/CreateAccountPage';


firebase.initializeApp({
  apiKey: "AIzaSyAeEVQiaQ5L9bNQfDUkW92LuGFDs8TvR6Q",
  authDomain: "experience-7e0a4.firebaseapp.com",
  projectId: "experience-7e0a4",
  storageBucket: "experience-7e0a4.appspot.com",
  messagingSenderId: "590954449427",
  appId: "1:590954449427:web:c61ce099bbe7679a4c8de6"
});





const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {

  

  const [user] = useAuthState(auth);
  const navigate = useNavigate();


  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        navigate('/')
      } else {
        navigate('/login')
      }
    });
  }, [user])
  


  const [allow, setAllow] = useState(false);
  const [startCoords, setStartCoords] = useState({
    quad: 0,
    x: 0,
    y: 0,
  });

  const loginUser = () => {
    setAllow(true);
  }

  return (
    <div className="App">
      <Routes>
        {!allow ? 
        <>
          <Route
            exact
            path="/"
            element={
              <LoginPage
                nav={navigate}
                auth={auth}
                usersRef={firestore.collection("users")}
                takenNamesRef={firestore.collection("taken_names").doc('all_names')}
                onLogin={() => loginUser()}
              />
            }
          />
          <Route
            path='/create-account'
            element={
              <CreateAccountPage
                nav={navigate}
                user={user}
                usersRef={firestore.collection('users')}
                takenNamesRef={firestore.collection('taken_names').doc('all_names')}
                onLogin={() => loginUser()}
              />
            }
          />
        </>
        :
          <>
            <Route path='/logout' element={<LogoutPage nav={navigate} auth={auth} />} />
            <Route 
              exact path={'/'}
              element={
                <HomePage 
                  user={user} 
                  userRef={firestore.collection('users').doc(user.uid)}
                  itemsRef = {firestore.collection('items')} 
                  eraseStartCoords={() => setStartCoords({
                    quad: 0,
                    x: 0,
                    y: 0,
                  })}
                />}
            />
            <Route
              path='/my-bank'
              element={<BankPage userRef={firestore.collection('users').doc(user.uid)} />}
            />
            <Route
              path='/general-store'
              element={
                <StorePage 
                  userRef={firestore.collection('users').doc(user.uid)} 
                  itemsRef={firestore.collection('items')}
                />}
            />
            <Route
              path='/outside'
              element={
                <OutsidePage 
                  userRef={firestore.collection('users').doc(user.uid)} 
                  allItemsRef={firestore.collection('items')}
                  itemsRef={firestore.collection('users').doc(user.uid).collection('items')}
                  featuresRef={firestore.collection('users').doc(user.uid).collection('game_features')}
                  saveStartCoords={(coordsObj) => setStartCoords(coordsObj)}
                  startCoords={startCoords}
                />
              }
            />
          </>
        }
      </Routes>
      <div className="nav-links">
        {allow ? (
          <>
            <Link className='link' to="/">Home</Link>
            <Link className='link' to='/my-bank'>Bank</Link>
            {/* <Link className='link' to='/general-store'>General Store</Link> */}
            <Link className='link' to='/outside'>Outside</Link>
            <Link className='link' to='/logout'>Logout</Link>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
