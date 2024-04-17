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
  id: string,
) {
  const chatsSnapshot = await getDocs(collection);
  const chat = chatsSnapshot.docs.find(
    (chatDoc: QueryDocumentSnapshot<DocumentData>) => chatDoc.data().id === id,
  );
  return chat ? chat : null;
}

export async function getDocsAll(
  collection: CollectionReference<DocumentData>,
) {
  const result = [];
  const docs = await getDocs(collection);
  docs.forEach((doc) => result.push(doc.data()));
  return result;
}

export async function updateDocField(
  collection: CollectionReference<DocumentData>,
  docId: string,
  fieldName: string,
  newValue: any,
) {
  try {
    const docRef = doc(collection, docId);
    await updateDoc(docRef, {
      [fieldName]: newValue,
    });
    return {
      success: true,
      message: "Field updated successfully",
      data: docRef,
    };
  } catch (e) {
    return { success: false, message: "Error updating field" };
  }
}
