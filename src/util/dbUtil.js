// export function openDB(name, version = 1, upgradeCallback) {
//   return new Promise((resolve, reject) => {
//     const req = indexedDB.open(name, version);

//     req.onupgradeneeded = (e) => {
//       const db = e.target.result;
//       upgradeCallback?.(db, e.target.transaction, e);
//     };

//     req.onsuccess = (e) => {
//       const db = e.target.result;
//       resolve(db);
//     };

//     req.onerror = (e) => reject(e.target.error);
//   });
// }

export function openDB(name, version = 2) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      // This runs only when DB is first created or version changes
      if (!db.objectStoreNames.contains("testCaseFileMetadata")) {
        // Use fileName as primary key so it's unique per file
        const store = db.createObjectStore("testCaseFileMetadata", {
          keyPath: "fileName",
        });
        // createIndex if you want to query by createdOn etc later
        store.createIndex("by_modifiedOn", "modifiedOn", { unique: false });
      }

      if (!db.objectStoreNames.contains("testCaseData")) {
        // Use fileName as primary key so it's unique per file
        const store = db.createObjectStore("testCaseData", {
          keyPath: "fileName",
        });
        // // createIndex if you want to query by createdOn etc later
        // store.createIndex("by_createdOn", "createdOn", { unique: false });
      }
    };

    req.onsuccess = (e) => {
      const db = e.target.result;
      db.onversionchange = () => {
        db.close();
        // If you want, notify user to reload. Keep simple here.
        console.warn("Database version changed elsewhere — reloading recommended.");
      };
      resolve(db);
    };

    req.onerror = (e) => reject(e.target.error);



  });
}

/** Get all records from an object store (returns Promise) */
export function getAllFilesMetadataFromStore(db, storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    console.log("inside getAllFilesMetadataFromStore Method : ", req)

    req.onsuccess = () => resolve(req.result || []);
    req.onerror = (e) => reject(e.target.error);
  });
}

/** Add (or put) a record into store */
export function putToStore(db, storeName, record) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.put(record); // put = add-or-update
    req.onsuccess = () => {
      resolve(req.result);
      console.log("Record put to store:", req);
    }
    req.onerror = (e) => reject(e.target.error);
  });
}

export function getTestCaseDataOfFileNameFromStore(db, storeName, fileName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(fileName);

    req.onsuccess = () => { console.log("onsuccess,", req.result); resolve(req.result || []) };
    req.onerror = (e) => reject(e.target.error);
  });
}

export function fileExists(db, storeName, filename) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.get(filename);

    request.onsuccess = () => {
      if (!!request.result) {

      }
      resolve(!!request.result);
    };

    request.onerror = () => reject(request.error);
  });
}

// checks if a filename is exisitng in the db, 
// if yes - it tries to append a ([number]) string to the filename and starts looking for it in the db,
//  if it is not found on db that is the new file name 
export async function generateUniqueFileName(db, storeName, filename) {
  const doesAFileWithThisFileNameExists = await fileExists(db, storeName, filename); // this returns true or false
  if (doesAFileWithThisFileNameExists) {
    for (let counter = 1; ; counter++) {
      console.log("inside for loop ")
      console.log("fileExists", await fileExists(db, "testCaseFileMetadata", filename + " (" + counter + ")"))
      //if a file does not exists with this filename, then that is the name of the file
      if (!await fileExists(db, "testCaseFileMetadata", filename + " (" + counter + ")")) {
        filename = filename + " (" + counter + ")";
        console.log(filename);
        return filename;
      }
    }
  }
  else {
    return filename;
  }

}

function countFilesContaining(db, substring) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    let count = 0;

    const req = store.openCursor();

    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) {
        resolve(count);
        return;
      }

      if (cursor.value.filename.includes(substring)) {
        count++;
      }

      cursor.continue();
    };

    req.onerror = () => reject(req.error);
  });
}

export function deleteFileFromIndexedDb(db, storeName, filename) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(filename);
    req.onsuccess = () => resolve(true);
    req.onerror = (e) => reject(e.target.error);
  });
}

export function updateFileNameInIndexedDb(db, storeName, oldFileName, newFileName) {
  return new Promise(async (resolve, reject) => {
    try {
      // Get existing record
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const getRequest = store.get(oldFileName);
      getRequest.onsuccess = async () => {
        const record = getRequest.result;
        console.log("record to be updated:", record);
        if (!record) {
          reject(new Error("Record not found"));
          return;
        }

        // Update the filename in the record
        const updatedRecord = { ...record, fileName: newFileName,  modifiedOn: new Date().toISOString() };
        console.log("updatedRecord:", updatedRecord);
        // Delete the old record
        const deleteRequest = store.delete(oldFileName);
        deleteRequest.onsuccess = async () => {
          // Add the updated record
          const putRequest = store.put(updatedRecord);
          putRequest.onsuccess = () => {
            console.log("Record updated with new filename:", putRequest.result);
            resolve(true);

          }
          putRequest.onerror = (e) => reject(e.target.error);
        };
        deleteRequest.onerror = (e) => reject(e.target.error);
      };

    } catch (error) {
      reject(error);
    } 
  });
}