import React, {useState} from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import ADD_SIGN_IN from "../reducers/ADD_SIGN_IN";

const LoginPage = (props) => {



  const makeAccountIfNone = async (user) => {
    let data;
    await props.usersRef
      .doc(user.uid)
      .get()
      .then((doc) => {
        data = doc.data();
      });

    if (data !== undefined) {
      return;
    } else {
  
      let allNamesList = [];
      await props.takenNamesRef.get().then(doc => {
        allNamesList = doc.data().list;
      });

      let username = prompt('Please enter a username: ');

      while (allNamesList.includes(username)) {
        username = prompt('That name has already been selected. Please enter a different one.')
      }

      const loginTime = new Date();
      await props.usersRef.doc(user.uid).set({
        accountBirthday: loginTime,
        lastLogin: loginTime,
        username: username,
        email: user.email,
        fitnessXp: 0,
        constructionXp: 0,
        cookingXp: 0,
        craftingXp: 0,
        farmingXp: 0,
        huntingXp: 0,
        medicineXp: 0,
      });
      await props.usersRef.doc(user.uid).collection('items').doc('coins').set({
        amount: Number(100),
        value: Number(100),
      });
      await props.takenNamesRef.set({
        list: allNamesList.concat(username)
      });
      props.nav('/');
    }
  };

  const login = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    props.auth.signInWithPopup(provider).then((data) => {
      makeAccountIfNone(data.user).then(() => {
        ADD_SIGN_IN(props.usersRef.doc(data.user.uid), new Date());
      })
      props.nav('/');
    });
  };

  return (
    <div className="page">
      <button className='login-button' onClick={() => login()}>Log In or Sign Up</button>
    </div>
  );
};

export default LoginPage;