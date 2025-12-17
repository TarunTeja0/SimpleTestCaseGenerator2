import logo from './logo.svg';
import './App.css';
import Home from './pages/home/Home';
import { Route, Router, Routes } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import Create from './pages/create/Create';
import Preview from './pages/preview/Preview';
import { tempFirstRowFieldsData, tempTestCasesData } from './util/temp';
import { getAllFilesMetadataFromStore, openDB } from './util/dbUtil';

export const TestCaseFileNameContext = createContext();
export const TestCaseTemplateContext = createContext();
export const ListOfTestCasesDataContext = createContext();
export const IDBContext = createContext();
function App() {
  const [testCaseFileName, setTestCaseFileName] = useState("");
  const [iDBConnection, setIDBConnection] = useState(null);
  console.log("idbConnection", iDBConnection);

  // const [firstRowFields, setFirstRowFields] = useState(tempFirstRowFieldsData ||
  // {
  //   "ID": { index: 0, type: "EMPTY", value: "" },
  //   "Work Item Type": { index: 1, type: "STATIC", value: "" },
  //   "Title": { index: 2, type: "DYNAMIC", value: "" },
  //   "Test Step": { index: 3, type: "DYNAMIC", value: "" },
  //   "Step Action": { index: 4, type: "DYNAMIC", value: "" },
  //   "Step Expected": { index: 5, type: "DYNAMIC", value: "" },
  //   "Custom.ExpectedResult": { index: 6, type: "DYNAMIC", value: "" },
  //   "Custom.DefectID": { index: 7, type: "EMPTY", value: "" },
  //   "Custom.ExecutedOn": { index: 8, type: "EMPTY", value: "" },
  //   "Custom.ExecutionResult": { index: 9, type: "EMPTY", value: "" },
  //   "Custom.ScenarioID": { index: 10, type: "PREFIX+SEQUENCE", value: "" },
  //   "Custom.Interface": { index: 11, type: "EMPTY", value: "" },
  //   "Custom.Module": { index: 12, type: "EMPTY", value: "" },
  //   "Custom.Precondition": { index: 13, type: "DYNAMIC", value: "" },
  //   "Custom.Scenariodescription": { index: 14, type: "EMPTY", value: "" },
  //   "Custom.SprintNo": { index: 15, type: "STATIC", value: "" },
  //   "Custom.SubModule": { index: 16, type: "EMPTY", value: "" },
  //   "Custom.TestCaseID": { index: 17, type: "PREFIX+SEQUENCE", value: "" },
  //   "Custom.TestCycle": { index: 18, type: "EMPTY", value: "" },
  //   "Custom.TestData": { index: 19, type: "EMPTY", value: "" },
  //   "Custom.UserRole": { index: 20, type: "CATEGORICAL", value: "" },
  //   "Custom.UserStoryID": { index: 21, type: "STATIC", value: "" },
  //   "Area Path": { index: 22, type: "STATIC", value: "" },
  //   "Assigned To": { index: 23, type: "STATIC", value: "" },
  //   "Custom.Environment": { index: 24, type: "STATIC", value: "" },
  //   "State": { index: 25, type: "STATIC", value: "" },
  //   "Tags": { index: 26, type: "CATEGORICAL", value: "" }
  // })
const [firstRowFields, setFirstRowFields] = useState({});

  console.log("firstRowFields: ", firstRowFields);

  // const [listOfTestCasesData, setListOfTestCasesData] = useState(tempTestCasesData || []);
  const [listOfTestCasesData, setListOfTestCasesData] = useState([]);


  console.log("TEst Case Filename", testCaseFileName);
  const saveTestCaseFileNameFunc = (TcFileName) => {
    setTestCaseFileName(TcFileName);
    console.log("after saving testcase filename in context", testCaseFileName)
  }

  console.log("list of test cases", listOfTestCasesData);

  // useEffect(()=>{
  // setFirstRowFields(tempFirstRowFieldsData);
  //   setListOfTestCasesData(tempTestCasesData);
  // },[]);

  useEffect(()=>{
    setFirstRowFields({
    "ID": { index: 0, type: "EMPTY", value: "" },
    "Work Item Type": { index: 1, type: "STATIC", value: "" },
    "Title": { index: 2, type: "DYNAMIC", value: "" },
    "Test Step": { index: 3, type: "DYNAMIC", value: "" },
    "Step Action": { index: 4, type: "DYNAMIC", value: "" },
    "Step Expected": { index: 5, type: "DYNAMIC", value: "" },
    "Custom.ExpectedResult": { index: 6, type: "DYNAMIC", value: "" },
    "Custom.DefectID": { index: 7, type: "EMPTY", value: "" },
    "Custom.ExecutedOn": { index: 8, type: "EMPTY", value: "" },
    "Custom.ExecutionResult": { index: 9, type: "EMPTY", value: "" },
    "Custom.ScenarioID": { index: 10, type: "PREFIX+SEQUENCE", value: "" },
    "Custom.Interface": { index: 11, type: "EMPTY", value: "" },
    "Custom.Module": { index: 12, type: "EMPTY", value: "" },
    "Custom.Precondition": { index: 13, type: "DYNAMIC", value: "" },
    "Custom.Scenariodescription": { index: 14, type: "EMPTY", value: "" },
    "Custom.SprintNo": { index: 15, type: "STATIC", value: "" },
    "Custom.SubModule": { index: 16, type: "EMPTY", value: "" },
    "Custom.TestCaseID": { index: 17, type: "PREFIX+SEQUENCE", value: "" },
    "Custom.TestCycle": { index: 18, type: "EMPTY", value: "" },
    "Custom.TestData": { index: 19, type: "EMPTY", value: "" },
    "Custom.UserRole": { index: 20, type: "CATEGORICAL", value: "" },
    "Custom.UserStoryID": { index: 21, type: "STATIC", value: "" },
    "Area Path": { index: 22, type: "STATIC", value: "" },
    "Assigned To": { index: 23, type: "STATIC", value: "" },
    "Custom.Environment": { index: 24, type: "STATIC", value: "" },
    "State": { index: 25, type: "STATIC", value: "" },
    "Tags": { index: 26, type: "CATEGORICAL", value: "" }
  });

  setListOfTestCasesData([]);
  },[])

useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Open DB and create store if not present
        const db = await openDB("TestCaseDB", 1, (db) => {
          // This runs only when DB is first created or version changes
          if (!db.objectStoreNames.contains("testCaseFileMetadata")) {
            // Use fileName as primary key so it's unique per file
            const store = db.createObjectStore("testCaseFileMetadata", {
              keyPath: "fileName",
            });
            // createIndex if you want to query by createdOn etc later
            store.createIndex("by_createdOn", "createdOn", { unique: false });
          }

          if (!db.objectStoreNames.contains("testCaseData")) {
            // Use fileName as primary key so it's unique per file
            const store = db.createObjectStore("testCaseData", {
              keyPath: "fileName",
            });
            // // createIndex if you want to query by createdOn etc later
            // store.createIndex("by_createdOn", "createdOn", { unique: false });
          }
        });

        // Optional: listen for versionchange so other tabs can't break things
        db.onversionchange = () => {
          db.close();
          // If you want, notify user to reload. Keep simple here.
          console.warn("Database version changed elsewhere — reloading recommended.");
        };

        // dbRef.current = db;
        setIDBConnection(db);

        // Load all file metadata into state
        // const all = await getAllFilesMetadataFromStore(db, "testCaseFileMetadata");
        // if (mounted) {
        //   // Sort by createdOn desc (newest first) if createdOn is ISO string
        //   all.sort((a, b) => (b.createdOn > a.createdOn ? 1 : -1));
        //   setFiles(all);
        //   setLoading(false);
        // }
      } catch (err) {
        console.error("Failed to open/load DB:", err);
        // if (mounted) {
        //   setFiles([]);
        //   setLoading(false);
        // }
      }
    })();

    return (db) => {
      mounted = false;
      // Close DB on unmount
      if (db) {
        try { db.close(); } catch (e) {}
        setIDBConnection(prev => {prev.close(); return null});
        db = null;
        console.log("db closed");
      }
    };
  }, []);

  return (
    <ListOfTestCasesDataContext.Provider value={{ listOfTestCasesData, setListOfTestCasesData }}>
      <TestCaseFileNameContext.Provider value={{ testCaseFileName, saveTestCaseFileNameFunc }}>
        <TestCaseTemplateContext.Provider value={{ firstRowFields, setFirstRowFields }} >
          <IDBContext.Provider value={{ iDBConnection, setIDBConnection }}>
            <div className="App">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/preview" element={<Preview />} />
                {/* <Route path="/contact" element={<Contact />} /> */}
                {/* 404 Page */}
                <Route path="*" element={<h1>404 Not Found</h1>} />
              </Routes>
            </div>
          </IDBContext.Provider>
        </TestCaseTemplateContext.Provider>
      </TestCaseFileNameContext.Provider>
    </ListOfTestCasesDataContext.Provider>
  );
}

export default App;
