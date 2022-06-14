export default async function ADD_BADGE(userRef, badgesRef, badgeObject) {

  let ownedAlready = false;
  let username;
  let allMaxBadges = [];

  await userRef.get().then(doc => {
    username = doc.data().username;
  })

  await userRef.collection('badges').get().then(snap => {
    snap.forEach(doc => {
      if (doc.id.substring(0, 9) === 'level_20_') {
        allMaxBadges.push(doc.id);
      }
    })
  });


  await userRef.collection('badges').doc(badgeObject.idTag).get().then(doc => {
    ownedAlready = doc.data() !== undefined;
  });

  if (!ownedAlready) {
    let badgeRefData;
    await userRef.collection('badges').doc(badgeObject.idTag).set({
      firstEarned: badgeObject.time,
      title: badgeObject.title,
      description: badgeObject.description,
      tier: badgeObject.tier,
    });
    await badgesRef.doc(badgeObject.idTag).get().then(doc => {
      badgeRefData = doc.data();
    });

    if (allMaxBadges.length === 0 && badgeObject.idTag.substring(0, 9) === 'level_20_') {
      ADD_BADGE(userRef, badgesRef, {
        idTag: 'level_20',
        time: badgeObject.time,
        title: 'Level 20',
        description: 'Train one of your skills to level 20.',
        tier: 1,
      })

      let l20data = [];
      await badgesRef.doc('level_20').get().then(doc => {
        l20data = doc.data();
      })
      l20data.users.push(username);
      badgesRef.doc('level_20').set({
        ...l20data
      });
    }

    if (badgeRefData.users.includes(username)) {
      return;
    }
    await badgesRef.doc(badgeObject.idTag).set({
      ...badgeRefData,
      users: badgeRefData.users.concat(username),
    });
  }
}