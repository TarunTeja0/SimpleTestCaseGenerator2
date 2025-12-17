export function openDB(name, version = 1, upgradeCallback) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      upgradeCallback?.(db, e.target.transaction, e);
    };

    req.onsuccess = (e) => {
      const db = e.target.result;
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

    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

export function getTestCaseDataOfFileNameFromStore(db, storeName, fileName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const req = store.get(fileName);

    req.onsuccess = () => {console.log("onsuccess,", req.result); resolve(req.result || [])};
    req.onerror = (e) => reject(e.target.error);
  });
}
