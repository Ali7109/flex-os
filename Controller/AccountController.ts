import { useAppSelector } from './../StateManagement/store';
import { user } from './../StateManagement/features/user-slice';
import { collection, addDoc, serverTimestamp, Firestore, CollectionReference, DocumentData, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
// import { User } from './types'; // Define your User type if not already defined
import { db } from '@/model/Firebase/Firebase';
import { User } from '@/model/Types/Types';

// Add a user to the Firestore "users" collection
export async function addAccount(user:User): Promise<boolean> {
  try {

    // Assuming db is your Firestore instance
    const accountsCollectionRef = collection(db, 'accounts');
    const checkQuery = query(accountsCollectionRef, where("email", "==", user.email));

    const checkQuerySnapshot = await getDocs(checkQuery);
    if(!checkQuerySnapshot.empty) {
        console.warn('User with the same ID already exists in Firestore');
        // User already exists
        return false;
    }

    // Add the user document to the "users" collection
    await addDoc(accountsCollectionRef, {
      timestamp: serverTimestamp(), // Server timestamp
      displayName: user.displayName,
      userId: user.userId,
        email: user.email,
        fileSystem: {},
    });

    return true; // User was successfully added
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
    return false; // User addition failed
  }
}
// Function to add a key-value pair to the fileSystem map in Firestore
export async function addToFileSystem(
    user: User,
    key: string,
    value: string
): Promise<boolean> {
    try {
        const accountDocRef = doc(db, 'accounts', user.email!);

        // Get the user document
        const userDocSnap = await getDoc(accountDocRef);
        if (!userDocSnap.exists()) {
            console.error('User document does not exist');
            return false;
        }

        // Get the existing fileSystem map or create a new one if it doesn't exist
        const fileSystem = userDocSnap.data()?.fileSystem || {};

        // Check if the key already exists in the fileSystem map
        if (fileSystem.hasOwnProperty(key)) {
            console.log(`Key '${key}' already exists in the fileSystem map`);
            return false;
        }

        // Add the key-value pair to the fileSystem map
        fileSystem[key] = value;

        // Update the user document with the modified fileSystem map and timestamp
        await setDoc(accountDocRef, {
            fileSystem,
        }, { merge: true }); // Merge with existing document if it exists

        return true; // Addition successful
    } catch (error) {
        console.error('Error adding to fileSystem:', error);
        return false; // Addition failed
    }
}
