import {
  addDoc,
  DocumentData,
  CollectionReference,
  getDocs,
  doc,
  updateDoc,
  QueryDocumentSnapshot,
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

export async function findRefById(
  collection: CollectionReference<DocumentData>,
  fieldName: string,
  id: string,
) {
  const snapshot = await getDocs(collection);
  const result = snapshot.docs.find(
    (doc: QueryDocumentSnapshot<DocumentData>) => doc.data()[fieldName] === id,
  );

  if (result) {
    return result;
  } else {
    return null;
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

export async function updateDocField(ref: any, updatedFields: any) {
  return await updateDoc(ref, updatedFields);
}
