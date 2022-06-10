import checkLevelUp from "../functions/checkLevelUp";

export default async function ADD_XP(userRef, skill, amount, levelUpFn) {

  let currentXp;
  let generalData;

  await userRef.get().then(doc => {
    generalData = doc.data();
    switch (skill) {
      case 'construction':
        currentXp = doc.data().constructionXp;
        userRef.set({
          ...generalData,
          constructionXp: Number(currentXp) + Number(amount),
        });
        break;
      case 'crafting':
        currentXp = doc.data().craftingXp;
        userRef.set({
          ...generalData,
          craftingXp: Number(currentXp) + Number(amount),
        });
        break;
      case 'cooking':
        currentXp = doc.data().cookingXp;
        userRef.set({
          ...generalData,
          cookingXp: Number(currentXp) + Number(amount),
        });
        break;
      case 'fitness':

        
        currentXp = doc.data().fitnessXp;
        let fitnessLevelUp = checkLevelUp(currentXp, amount);
        if (fitnessLevelUp) {
          levelUpFn();
        }
        userRef.set({
          ...generalData,
          fitnessXp: Number(currentXp) + Number(amount),
          currentEnergy: fitnessLevelUp ? (Number(generalData.currentEnergy + 1)) : generalData.currentEnergy
        });
        break;
      case 'farming':
        currentXp = doc.data().farmingXp;
        userRef.set({
          ...generalData,
          farmingXp: Number(currentXp) + Number(amount),
        });
        break;
      case 'hunting':
        currentXp = doc.data().huntingXp;
        userRef.set({
          ...generalData,
          huntingXp: Number(currentXp) + Number(amount),
        });
        break;
      case 'medicine':
        
        currentXp = doc.data().medicineXp;
        let medicineLevelUp = checkLevelUp(currentXp, amount);
        console.log('medicineLevelUp: ' + medicineLevelUp ? 'true' : 'false');
        if (medicineLevelUp) {
          levelUpFn();
        }
        userRef.set({
          ...generalData,
          medicineXp: Number(currentXp) + Number(amount),
          currentHealth: medicineLevelUp ? (Number(generalData.currentHealth) + 1) : Number(generalData.currentHealth),
        });
        break;
      default:
        break;
    }
  })
}