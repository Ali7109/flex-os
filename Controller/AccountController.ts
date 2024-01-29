import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/model/Firebase/Firebase';
import { User } from '@/model/Types/Types';
import { sortKeys } from '@/model/HelperFunctions';
import Database from '@/model/CommandDataStructures/Database';

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
    timeOfCreation: string,
    user: User,
    key: string,
    value: string
): Promise<boolean> {
    try {

        let guestUser = timeOfCreation === "";

        if(guestUser){
            const locDb = Database.getInstance();

            if(!locDb.has(key)){
                let added = locDb.set(key, value);
                if (added){
                    return true;
                }
            }
            return false
        }

        // Get the accounts collection reference
        const accountsCollectionRef = collection(db, 'accounts');

        // Query to find the user document by email
        const checkQuery = query(accountsCollectionRef, where("email", "==", user.email));

        // Execute the query
        const checkQuerySnapshot = await getDocs(checkQuery);

        // Check if the user document exists
        if (checkQuerySnapshot.empty) {
            console.warn("User doesn't exist in Firestore");
            return false;
        }

        // Get the user document
        const userDoc = checkQuerySnapshot.docs[0];

        // Get the existing fileSystem map or create a new one if it doesn't exist
        const fileSystem = userDoc.data().fileSystem || {};

        // Check if the key already exists in the fileSystem map
        if (fileSystem.hasOwnProperty(key)) {
            console.log(`Key '${key}' already exists in the fileSystem map`);
            return false;
        }

        // Add the key-value pair to the fileSystem map
        fileSystem[key] = {
            value,
            timeOfCreation,
            serverTimestamp: serverTimestamp(),
        };

        // Update the user document with the modified fileSystem map and timestamp
        await setDoc(userDoc.ref, {
            fileSystem,
        }, { merge: true }); // Merge with existing document if it exists

        return true; // Addition successful
    } catch (error) {
        console.error('Error adding to fileSystem:', error);
        return false; // Addition failed
    }
}

interface FileSystemEntry {
    value: string;
    timeOfCreation: string;
    serverTimestamp: typeof serverTimestamp
}


// Function to get the list of file keys from the fileSystem map in Firestore
export async function getFiles(user: User): Promise<string> {
    try {
         // Get the accounts collection reference
         const accountsCollectionRef = collection(db, 'accounts');

         // Query to find the user document by email
         const checkQuery = query(accountsCollectionRef, where("email", "==", user.email));
 
         // Execute the query
         const checkQuerySnapshot = await getDocs(checkQuery);
 
         // Check if the user document exists
         if (checkQuerySnapshot.empty) {
             console.warn("User doesn't exist in Firestore");
             return "";
         }
        
        // Get the user document
        const userDoc = checkQuerySnapshot.docs[0];

        // Get the existing fileSystem map or create a new one if it doesn't exist
        const fileSystem: Record<string, FileSystemEntry> = userDoc.data().fileSystem || {};


        // Extract keys from the fileSystem map
        const keys = Object.keys(fileSystem).sort(sortKeys);
         
        let files = "";
        keys.forEach((key) => {
            const value = fileSystem[key];
            files += value.timeOfCreation + " || " + key + ".<br>";
        })

        return files;

    } catch (error) {
        console.error('Error getting files:', error);
        return ""; // Return empty array if an error occurs
    }
}

// Function to get the content of a file using its key from the fileSystem map in Firestore
export async function getFileContent(user: User, key: string): Promise<string | null> {
    try {
       // Get the accounts collection reference
       const accountsCollectionRef = collection(db, 'accounts');

       // Query to find the user document by email
       const checkQuery = query(accountsCollectionRef, where("email", "==", user.email));

       // Execute the query
       const checkQuerySnapshot = await getDocs(checkQuery);

       // Check if the user document exists
       if (checkQuerySnapshot.empty) {
           console.warn("User doesn't exist in Firestore");
           return "";
       }
      
      // Get the user document
      const userDoc = checkQuerySnapshot.docs[0];

      // Get the existing fileSystem map or create a new one if it doesn't exist
      const fileSystem = userDoc.data().fileSystem || {};

        // Retrieve the value of the specified key from the fileSystem map
        const fileContent = fileSystem[key];
        
        let content = fileContent.value;
        content = content.replace(/\n/g, "<br>");

        const timeOfCreation = fileContent.timeOfCreation;

        let returnString = "Reading file: " + key + "<br>" + "Created on: " + timeOfCreation + "<br><br>" + "Content: " + content;
        
        return returnString; // Return file content if found, otherwise return null
    } catch (error) {
        console.error('Error getting file content:', error);
        return null; // Return null if an error occurs
    }
}


export async function deleteFile(user: User, key: string): Promise<boolean> {
    try {
        const accountsCollectionRef = collection(db, 'accounts');
        const checkQuery = query(accountsCollectionRef, where("email", "==", user.email));
        const checkQuerySnapshot = await getDocs(checkQuery);

        if (checkQuerySnapshot.empty) {
            console.warn("User doesn't exist in Firestore");
            return false;
        }

        const userDoc = checkQuerySnapshot.docs[0];
        const fileSystem = userDoc.data().fileSystem || {};

        if (!fileSystem.hasOwnProperty(key)) {
            console.warn(`File '${key}' not found in the fileSystem`);
            return false;
        }

        delete fileSystem[key];
        await updateDoc(doc(db, 'accounts', userDoc.id), { fileSystem });

        console.log(`File '${key}' deleted successfully`);
        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
}
