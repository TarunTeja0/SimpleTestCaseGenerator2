// src/pages/Home.js
import React, { useContext, useEffect, useRef, useState } from "react";
import Dialog from "./Dialog";
import HomeTestCaseCard from "./HomeTestCaseCard";
import { tr } from "framer-motion/client";
import { fileExists, generateUniqueFileName, getAllFilesMetadataFromStore, openDB, putToStore } from "../../util/dbUtil";
import { IDBContext } from "../../App";
import FilePicker from "./FilePicker";
import excelReader from "../../util/excelReader";
import convertArrayOfRowsIntoListOfTestCases from "../../util/convertArrayOfRowsIntoListOfTestCases";
import { useNavigate } from "react-router-dom";







export default function Home() {
    const [openDialog, setOpenDialog] = useState(false);

    const [files, setFiles] = useState([]); // store objects: { fileName, modifiedOn }
    const [loading, setLoading] = useState(true);
    const dbRef = useRef(null);

    const [fading, setFading] = useState(false);

    const {iDBConnection, setIDBConnection} = useContext(IDBContext);

    const navigate = useNavigate();
    const [isImported, setIsImported] = useState(false);

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
         
          console.log("home lo inside useEffect", iDBConnection?.transaction("testCaseFileMetadata","readonly"));
  
          const all = await getAllFilesMetadataFromStore(iDBConnection, "testCaseFileMetadata");
          if (mounted) {
            // Sort by modifiedOn desc (newest first) if modifiedOn is ISO string
            all.sort((a, b) => (b.modifiedOn > a.modifiedOn ? 1 : -1));
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
    // else{
    //   (async () => {
    //   try {
    //     // Open DB and create store if not present
    //     const db = await openDB("TestCaseDB", 1);
    //     setIDBConnection(db);      
    //   } catch (err) {
    //     console.error("Failed to open/load DB:", err);
    //   }
    // })();
    // }

    

    // return () => {
    // //   mounted = false;
    // //   // Close DB on unmount
    // //   if (dbRef.current) {
    // //     try { dbRef.current.close(); } catch (e) {}
    // //     dbRef.current = null;
    //   if (iDBConnection) {
    //     // try { iDBConnection.close(); } catch (e) {}
    //     // setIDBConnection(prev => {prev.close(); return null});
    //     console.log("db closed");
    //   }
    // //   }
    // };
  }, [iDBConnection]);

    const addNewFile = async (name) => {
    // const name = prompt("Enter file name (unique):", `test-${Date.now()}`);
    if (!name) return;
    const record = {
      fileName: name,
      modifiedOn: new Date().toISOString(), // use ISO string for easy sorting
    };
    try {
      await putToStore(iDBConnection, "testCaseFileMetadata", record);
      // refresh local state (you could also optimistic-update)
      console.log("addNewFile", iDBConnection);
      const all = await getAllFilesMetadataFromStore(iDBConnection, "testCaseFileMetadata");
      all.sort((a, b) => (b.modifiedOn > a.modifiedOn ? 1 : -1));
      setFiles(all);
    } catch (err) {
      console.error("Error adding file metadata:", err);
      // alert("Failed to add file. Check console.");
    }
  };

    const saveImportedTestCasesDataOnIndexedDB = async (testCaseFileName, listOfTestCasesData, firstRowFields) => {
        try {
            const result = await putToStore(iDBConnection, "testCaseData", { fileName: testCaseFileName, listOfTestCasesData, firstRowFields });
            console.log("on record insertion to db,", result);
            // setIsUnsaved(false);
            if (result && result.success) {
                console.log("Record saved:", result);
            }
        }
        catch (error) {
            console.log("error on record insertion to db,", error);
        }
    }

  const saveImportedFileOnIndexedDB = async(name) =>{
    console.log(name);
    console.log(!!iDBConnection);
    //checking if db connection undha ledha ani
    if(iDBConnection){
      if (!name) return;
      // const uniqueFileName = await generateUniqueFileName(iDBConnection, "testCaseFileMetadata", name)
      // console.log("does a file exists ", doesAFileNameExistds);
      // console.log("unique file name", uniqueFileName);
    // if(doesAFileNameExistds){
    //   console.log("does a filename exists", doesAFileNameExistds);
      // for(let counter=1;;counter++){
      //   console.log("inside for loop ")
      //   console.log("fileExists",await fileExists(iDBConnection,"testCaseFileMetadata", name +" ("+ counter + ")"))
      //   if(!await fileExists(iDBConnection,"testCaseFileMetadata", name +" ("+ counter + ")")){
      //     name = name +" ("+ counter + ")";
      //     console.log(name);
      //     break;
      //   }
      // }
    // }
    const record = {
      fileName: name,
      modifiedOn: new Date().toISOString(), // use ISO string for easy sorting
    };
    try {
      await putToStore(iDBConnection, "testCaseFileMetadata", record);
      // refresh local state (you could also optimistic-update)
      console.log("addNewFile", iDBConnection);
      const all = await getAllFilesMetadataFromStore(iDBConnection, "testCaseFileMetadata");
      all.sort((a, b) => (b.modifiedOn > a.modifiedOn ? 1 : -1));
      setFiles(all);
    } catch (err) {
      console.error("Error adding file metadata:", err);
      // alert("Failed to add file. Check console.");
    }
    }

  }

  const onFileSelect = async (e) => {
      console.log("on file pick", e.target.files[0]);
      const fileName = e.target.files[0].name;
      const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf("."));
      console.log("fileName", fileName);
      const file = e.target.files[0];
      if(!file) return; //if file null or invalid aithey return chesestham
      const arrayOfRows = await excelReader(file);
      const [importedFileFirstRowFieldsData, importedListOfTestCases] =  convertArrayOfRowsIntoListOfTestCases(arrayOfRows);
      // setIsImported(true); //TODO
      console.log(iDBConnection);
          // console.log("fileExists", await fileExists(iDBConnection, "testCaseFileMetadata", "Test Scenario 1"))
      const uniqueFileName = await generateUniqueFileName(iDBConnection, "testCaseFileMetadata", fileNameWithoutExtension);
      saveImportedFileOnIndexedDB(uniqueFileName);
      saveImportedTestCasesDataOnIndexedDB(uniqueFileName, importedListOfTestCases, importedFileFirstRowFieldsData);
      

    }

    //if emaina import chesthey ee use effect trigger avthadhi and then navigation to create page ki pothaam
    useEffect(()=>{
      if(isImported){

        navigate("/create");
      }
    }, [isImported])

  return (
    <div className={`relative min-h-screen bg-gray-50 p-6 transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}>
      {/* Title */}
      <div className="relative ">

  <div class="text-center mb-8">
  <h1 class="text-3xl font-bold text-blue-600">
    Test Case Builder
  </h1>
  <p class="text-gray-500 mt-1">
    Create and manage your test cases
  </p>
</div>

      

     
      <FilePicker onFileSelect={onFileSelect} />

     



      </div>
      

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
        <div>You haven’t added any scenarios yet. Click + to get started!.</div>
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

        <Dialog open={openDialog} onClose={()=>setOpenDialog(prevState => !prevState)} onSave= {addNewFile} title="Create new Test Cases" />


    </div>
  );
}
