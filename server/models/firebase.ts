import {
  addDoc,
  DocumentData,
  CollectionReference,
  getDocs,
} from "firebase/firestore";

export async function addToCollection(
  collection: CollectionReference<DocumentData>,
  data: any,
) {
  try {
    const docRef = await addDoc(collection, data);

    return { success: true, message: "Data added successfully", data: docRef };
  } catch (e) {
    return { success: false, message: "Internal Server Error" };
  }
}

export async function getDocsAll(
  collection: CollectionReference<DocumentData>,
) {
  const result = [];
  const docs = await getDocs(collection);
  docs.forEach((doc) => result.push(doc.data()));
  return result;
}
