import firebase from '../database/firebase';

export async function createPayment(newArray, userId) {
  const db = firebase.firestore();

  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  const checkPaymentExists = async (name, price, date, userId) => {
    const querySnapshot = await db
      .collection('payments')
      .where('name', '==', name)
      .where('price', '==', price)
      .where('date', '==', date)
      .where('userId', '==', userId)
      .get();

    return !querySnapshot.empty;
  };

  const addPaymentIfNotExists = async (item) => {
    try {
      const paymentExists = await checkPaymentExists(
        item.name,
        item.price,
        formattedDate,
        userId
      );

      if (!paymentExists) {
        await db.collection('payments').add({
          name: item.name,
          price: item.price,
          date: formattedDate,
          userId: userId,
        });
        console.log(`Payment for ${item.name} added successfully.`);
      } else {
        console.log(`Payment for ${item.name} already exists. Skipping.`);
      }
    } catch (error) {
      console.error(`Error adding payment for ${item.name}:`, error);
    }
  };
  for (const item of newArray) {
    await addPaymentIfNotExists(item);
  }
}