import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function createOrder({ userId, items, totalPrice, customer }) {
  const orderPayload = {
    userId,
    items,
    totalPrice,
    customer,
    timestamp: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "orders"), orderPayload);
  return docRef.id;
}
