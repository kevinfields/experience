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


firebase.initializeApp({
  apiKey: "AIzaSyAeEVQiaQ5L9bNQfDUkW92LuGFDs8TvR6Q",
  authDomain: "experience-7e0a4.firebaseapp.com",
  projectId: "experience-7e0a4",
  storageBucket: "experience-7e0a4.appspot.com",
  messagingSenderId: "590954449427",
  appId: "1:590954449427:web:c61ce099bbe7679a4c8de6"
});

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);
  const navigate = useNavigate();


  return (
    <div className="App">
      <Routes>
        {!user ? 
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
              />
            }
          />
        </>
        :
          <>
            <Route 
              exact path={'/'}
              element={
                <HomePage 
                  user={user} 
                  userRef={firestore.collection('users').doc(user.uid)}
                  itemsRef = {firestore.collection('items')}  
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
                <OutsidePage userRef={firestore.collection('users').doc(user.uid)} />
              }
            />
          </>
        }
      </Routes>
      <div className="nav-links">
        {user ? (
          <>
            <Link className='link' to="/">Home</Link>
            <Link className='link' to='/my-bank'>Bank</Link>
            <Link className='link' to='/general-store'>General Store</Link>
            <Link className='link' to='/outside'>Outside</Link>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
