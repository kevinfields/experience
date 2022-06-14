import checkLevelUp from "../functions/checkLevelUp";
import ADD_BADGE from "./ADD_BADGE";

export default async function ADD_XP(userRef, skill, amount, badgesRef, levelUpFn) {

  let currentXp;
  let newTotal;
  let generalData;

  await userRef.get().then(doc => {
    generalData = doc.data();
    switch (skill) {
      case 'construction':
        currentXp = doc.data().constructionXp;
        newTotal = Number(currentXp) + Number(amount);
        userRef.set({
          ...generalData,
          constructionXp: newTotal,
        });
        if (newTotal >= 30000) {
          ADD_BADGE(userRef, badgesRef, {
            idTag: 'level_20_construction',
            title: 'Level 20 Construction',
            description: 'Train your construction skill to level 20.',
            time: new Date(),
            tier: 1,
          })
        }
        break;
      case 'crafting':
        currentXp = doc.data().craftingXp;
        newTotal = Number(currentXp) + Number(amount);
        userRef.set({
          ...generalData,
          craftingXp: newTotal,
        });
        if (newTotal >= 30000) {
          ADD_BADGE(userRef, badgesRef, {
            idTag: 'level_20_crafting',
            title: 'Level 20 Crafting',
            description: 'Train your crafting skill to level 20.',
            time: new Date(),
            tier: 1,
          })
        }
        break;
      case 'cooking':
        currentXp = doc.data().cookingXp;
        newTotal = Number(currentXp) + Number(amount);
        userRef.set({
          ...generalData,
          cookingXp: newTotal,
        });
        if (newTotal >= 30000) {
          ADD_BADGE(userRef, badgesRef, {
            idTag: 'level_20_cooking',
            title: 'Level 20 Cooking',
            description: 'Train your cooking skill to level 20.',
            time: new Date(),
            tier: 1,
          })
        }
        break;
      case 'fitness':
        currentXp = doc.data().fitnessXp;
        newTotal = Number(currentXp) + Number(amount);
        let fitnessLevelUp = checkLevelUp(currentXp, amount);
        if (fitnessLevelUp) {
          levelUpFn();
        }
        userRef.set({
          ...generalData,
          fitnessXp: newTotal,
          currentEnergy: fitnessLevelUp ? (Number(generalData.currentEnergy + 1)) : generalData.currentEnergy
        });
        if (newTotal >= 30000) {
          ADD_BADGE(userRef, badgesRef, {
            idTag: 'level_20_fitness',
            title: 'Level 20 Fitness',
            description: 'Train your fitness skill to level 20.',
            time: new Date(),
            tier: 2,
          })
        }
        break;
      case 'farming':
        currentXp = doc.data().farmingXp;
        newTotal = Number(currentXp) + Number(amount);
        userRef.set({
          ...generalData,
          farmingXp: newTotal,
        });
        if (newTotal >= 30000) {
          ADD_BADGE(userRef, badgesRef, {
            idTag: 'level_20_farming',
            title: 'Level 20 Farming',
            description: 'Train your farming skill to level 20.',
            time: new Date(),
            tier: 2,
          })
        }
        break;
      case 'hunting':
        currentXp = doc.data().huntingXp;
        newTotal = Number(currentXp) + Number(amount);
        userRef.set({
          ...generalData,
          huntingXp: newTotal,
        });
        if (newTotal >= 30000) {
          ADD_BADGE(userRef, badgesRef, {
            idTag: 'level_20_hunting',
            title: 'Level 20 Hunting',
            description: 'Train your hunting skill to level 20.',
            time: new Date(),
            tier: 2,
          })
        }
        break;
      case 'medicine':
        
        currentXp = doc.data().medicineXp;
        newTotal = Number(currentXp) + Number(amount);
        let medicineLevelUp = checkLevelUp(currentXp, amount);
        if (medicineLevelUp) {
          levelUpFn();
        }
        userRef.set({
          ...generalData,
          medicineXp: newTotal,
          currentHealth: medicineLevelUp ? (Number(generalData.currentHealth) + 1) : Number(generalData.currentHealth),
        });
        if (newTotal >= 30000) {
          ADD_BADGE(userRef, badgesRef, {
            idTag: 'level_20_medicine',
            title: 'Level 20 Medicine',
            description: 'Train your medicine skill to level 20.',
            time: new Date(),
            tier: 2,
          })
        }
        break;
      default:
        break;
    }
  })
}