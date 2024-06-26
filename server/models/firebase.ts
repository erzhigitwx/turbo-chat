import {
  addDoc,
  DocumentData,
  CollectionReference,
  getDocs,
  deleteDoc,
  updateDoc,
  QueryDocumentSnapshot,
  query,
  where,
  collection,
} from "firebase/firestore";
import { UserData } from "../types/user.js";
import { chatsCollection, storage } from "../config/index.js";
import { ref, deleteObject, listAll } from "firebase/storage";

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

export async function updateMessagesStatus(
  collectionRef: CollectionReference<DocumentData>,
  userData: UserData,
) {
  try {
    const q = query(
      collectionRef,
      where("senderId", "!=", userData.uid),
      where("status", "==", "send"),
    );
    const querySnapshot = await getDocs(q);
    const promises = [];
    querySnapshot.forEach((doc) => {
      promises.push(updateDoc(doc.ref, { status: "check" }));
    });
    await Promise.all(promises);
    return { success: true, message: "Status updated successfully" };
  } catch (error) {
    console.error("Error updating message status:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

export async function updateClearChat(chatId: string, clearedFor: string[]) {
  try {
    const chatRef = await findRefById(chatsCollection, "id", chatId);
    const messagesCollectionRef = collection(chatRef.ref, "messages");
    const querySnapshot = await getDocs(messagesCollectionRef);
    const mediaRef = ref(storage, `/media/${chatId}`);
    const mediaFiles = await listAll(mediaRef);

    querySnapshot.forEach((doc) => {
      const currentClearedFor = doc.data().clearedFor || [];
      const newClearedFor = [
        ...currentClearedFor,
        ...clearedFor.filter((id) => !currentClearedFor.includes(id)),
      ];
      if (newClearedFor.length > 1) {
        mediaFiles.items.map((fileRef) => deleteObject(fileRef));
        deleteDoc(doc.ref);
      } else {
        updateDoc(doc.ref, {
          clearedFor: newClearedFor,
        });
      }
    });

    return { success: true, message: "Chat cleared successfully" };
  } catch (error) {
    console.error("Error updating message status:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

export async function updateDeleteChat(chatId: string, deleteFor: string[]) {
  try {
    const chatRef = await findRefById(chatsCollection, "id", chatId);
    const currentDeletedFor = chatRef.data().deletedFor || [];
    const newClearedFor = [
      ...currentDeletedFor,
      ...deleteFor.filter((id) => !currentDeletedFor.includes(id)),
    ];
    if (newClearedFor.length > 1) {
      await deleteDoc(chatRef.ref);
    } else {
      await updateDoc(chatRef.ref, {
        deletedFor: newClearedFor,
      });
    }

    return { success: true, message: "Chat cleared successfully" };
  } catch (error) {
    console.error("Error updating message status:", error);
    return { success: false, message: "Internal Server Error" };
  }
}
