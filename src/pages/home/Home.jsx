// src/pages/Home.js
import React, { useContext, useEffect, useRef, useState } from "react";
import Dialog from "./Dialog";
import HomeTestCaseCard from "./HomeTestCaseCard";
import { tr } from "framer-motion/client";
import { getAllFilesMetadataFromStore, openDB, putToStore } from "../../util/dbUtil";
import { IDBContext } from "../../App";







export default function Home() {
    const [openDialog, setOpenDialog] = useState(false);

    const [files, setFiles] = useState([]); // store objects: { fileName, createdOn }
    const [loading, setLoading] = useState(true);
    const dbRef = useRef(null);

    const [fading, setFading] = useState(false);

    const {iDBConnection, setIDBConnection} = useContext(IDBContext);

  // const cards = [
  //   { id: 1, title: "Card 1", description: "This is card one." },
  //   { id: 2, title: "Card 2", description: "This is card two." },
  //   { id: 3, title: "Card 3", description: "This is card three." },
  // ];

  useEffect(() => {
    let mounted = true;
    if(iDBConnection){
      (async () => {
        try {
          // // Open DB and create store if not present
          // const db = await openDB("TestCaseDB", 1, (db) => {
          //   // This runs only when DB is first created or version changes
          //   if (!db.objectStoreNames.contains("testCaseFileMetadata")) {
          //     // Use fileName as primary key so it's unique per file
          //     const store = db.createObjectStore("testCaseFileMetadata", {
          //       keyPath: "fileName",
          //     });
          //     // createIndex if you want to query by createdOn etc later
          //     store.createIndex("by_createdOn", "createdOn", { unique: false });
          //   }
  
          //   if (!db.objectStoreNames.contains("testCaseData")) {
          //     // Use fileName as primary key so it's unique per file
          //     const store = db.createObjectStore("testCaseData", {
          //       keyPath: "fileName",
          //     });
          //     // // createIndex if you want to query by createdOn etc later
          //     // store.createIndex("by_createdOn", "createdOn", { unique: false });
          //   }
          // });
  
          // Optional: listen for versionchange so other tabs can't break things
          // db.onversionchange = () => {
          //   db.close();
          //   // If you want, notify user to reload. Keep simple here.
          //   console.warn("Database version changed elsewhere — reloading recommended.");
          // };
  
          // dbRef.current = db;
          // setIDBConnection(db);
  
          // Load all file metadata into state
  
          console.log("home lo inside useEffect", iDBConnection?.transaction("testCaseFileMetadata","readonly"));
  
          const all = await getAllFilesMetadataFromStore(iDBConnection, "testCaseFileMetadata");
          if (mounted) {
            // Sort by createdOn desc (newest first) if createdOn is ISO string
            all.sort((a, b) => (b.createdOn > a.createdOn ? 1 : -1));
            setFiles(all);
            setLoading(false);
          }
        } catch (err) {
          console.error("Failed to open/load DB:", err);
          if (mounted) {
            setFiles([]);
            setLoading(false);
          }
        }
      })();
    }

    return () => {
    //   mounted = false;
    //   // Close DB on unmount
    //   if (dbRef.current) {
    //     try { dbRef.current.close(); } catch (e) {}
    //     dbRef.current = null;

    //   }
    };
  }, [iDBConnection]);

    const addNewFile = async (name) => {
    // const name = prompt("Enter file name (unique):", `test-${Date.now()}`);
    if (!name) return;
    const record = {
      fileName: name,
      createdOn: new Date().toISOString(), // use ISO string for easy sorting
    };
    try {
      await putToStore(iDBConnection, "testCaseFileMetadata", record);
      // refresh local state (you could also optimistic-update)
      console.log("addNewFile", iDBConnection);
      const all = await getAllFilesMetadataFromStore(iDBConnection, "testCaseFileMetadata");
      all.sort((a, b) => (b.createdOn > a.createdOn ? 1 : -1));
      setFiles(all);
    } catch (err) {
      console.error("Error adding file metadata:", err);
      // alert("Failed to add file. Check console.");
    }
  };

  return (
    <div className={`relative min-h-screen bg-gray-50 p-6 transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}>
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-16 text-gray-800">
        My Home Page
      </h1>

      {/* Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl shadow-md p-6 hover:scale-[1.02] transition-transform"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-700">
              {card.title}
            </h3>
            <p className="text-gray-600">{card.description}</p>
          </div>
        ))} */}
      </div>

       {loading ? (
        <div>Loading…</div>
      ) : files.length === 0 ? (
        <div>No test case files yet. Click “Add new file”.</div>
      ) : (
        // <div style={{ display: "grid", gap: 12 }}>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {files.map((f) => {
            console.log("inside map of files-homescreen" , f);
            return <HomeTestCaseCard key={f.fileName} f={f} setFading={()=>setFading(true)} />
          })}
          </div>)
        }

      {/* Floating + button */}
      <button className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white text-3xl w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
                onClick={()=>setOpenDialog(prevState => !prevState)}
      >
        +
      </button>

        <Dialog open={openDialog} onClose={()=>setOpenDialog(prevState => !prevState)} onSave= {addNewFile}/>


    </div>
  );
}
