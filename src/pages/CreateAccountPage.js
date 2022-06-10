import React, {useState, useEffect} from 'react'

const valid = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const CreateAccountPage = (props) => {

  const [taken, setTaken] = useState([]);
  const [username, setUsername] = useState('');

  const loadTakenNames = async () => {
    let nameArr = [];
    await props.takenNamesRef.get().then(doc => {
      nameArr = doc.data().list;
    })
    setTaken(nameArr);
  };

  const check = () => {

    let nameArr = username.split('');
    if (taken.includes(username)) {
      alert('That name is already taken.'); 
      return;
    }

    if (nameArr.length > 15) { 
      alert('You name must be 15 characters or less.');
      return;
    }

    if (nameArr.length < 2) {
      alert('Your name must be at least two characters.');
      return;
    }

    for (const letter of nameArr) {
      if (!valid.includes(letter.toLowerCase())) {
        alert('You may only use letters, numbers, and spaces.');
        return;
      }
    }

    if (window.confirm('Are you sure? This username cannot be changed.')) {
      firstLogin();
    } else {
      return;
    }
  }

  const firstLogin = async () => {
    const loginTime = new Date();
      await props.usersRef.doc(props.user.uid).set({
        accountBirthday: loginTime,
        lastLogin: loginTime,
        username: username,
        email: props.user.email,
        fitnessXp: 0,
        constructionXp: 0,
        cookingXp: 0,
        craftingXp: 0,
        farmingXp: 0,
        huntingXp: 0,
        medicineXp: 0,
        currentHealth: 10,
        currentEnergy: 10,
      });
      await props.usersRef.doc(props.user.uid).collection('items').doc('coins').set({
        amount: Number(100),
        value: Number(100),
      });
      await props.takenNamesRef.set({
        list: taken.concat(username)
      });
      props.onLogin();
      props.nav('/');
  }

  useEffect(() => {
    loadTakenNames();
  }, [])

  return (
    <div className='page'>
      <div className='create-account-screen'>
        <p>Enter a Username: </p>
        <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={() => check()}>Check</button>
      </div>
    </div>
  )
}

export default CreateAccountPage