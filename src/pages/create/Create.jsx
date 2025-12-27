import { createContext, useContext, useEffect, useState } from "react";
import { IDBContext, ListOfTestCasesDataContext, TestCaseFileNameContext, TestCaseTemplateContext } from "../../App";
import TopFoldNavSheet from "./TopFoldNavSheet";
import LeftMain from "./LeftMain";
import RightMain from "./RightMain";
import { useNavigate } from "react-router-dom";
import { openDB, putToStore } from "../../util/dbUtil";
import { Brain, Upload } from "lucide-react";
import PromptJsonDialog from "./PromptDialog";
import ExitConfirmationDialog from "./ExitConfirmationDialog";

export const ClipboardContext = createContext();
export const IsUnsavedContext = createContext();

export default function Create() {
    const { testCaseFileName, saveTestCaseFileNameFunc } = useContext(TestCaseFileNameContext);
    const [clipboardTestCaseData, setClipboardTestCaseData] = useState(null);
    const { listOfTestCasesData, setListOfTestCasesData } = useContext(ListOfTestCasesDataContext);
    const { firstRowFields, setFirstRowFields } = useContext(TestCaseTemplateContext);

    const [openDialog, setOpenDialog] = useState(false);
    const [openExitConfirmationDialog, setOpenExitConfirmationDialog] = useState(false);
    const [isUnsaved, setIsUnsaved] = useState(false);
    console.log(isUnsaved);

    const navigate = useNavigate();
    const [fading, setFading] = useState(false);
    const { iDBConnection, setIDBConnection } = useContext(IDBContext);

    const updateModifiedOnInMetadataStore = async () => {
        try {
            const result = await putToStore(iDBConnection, "testCaseFileMetadata", { fileName: testCaseFileName, modifiedOn: new Date().toISOString() });
        } catch (error) {
            console.log("error on updating modifiedOn in metadata store", error);
        }
    };

    const saveOnIndexedDBFunc = async () => {
        console.log("inside saveOnIndexedDBFunc");
        try {
            const result = await putToStore(iDBConnection, "testCaseData", { fileName: testCaseFileName, listOfTestCasesData, firstRowFields });
            console.log("on record insertion to db,", result);
            // setIsUnsaved(false);
            // if (result && result.success) {
            if(!!result){ //checking if result is not null or undefined because putToStore returns the key of the stored record on success
                //reinserting the record with same filename with the updated modifiedOn field name will result in updating the existing record's modifiedOn field                
                const result = await putToStore(iDBConnection, "testCaseFileMetadata", { fileName: testCaseFileName, modifiedOn: new Date().toISOString() });
                console.log("Record saved:", result);
                
                if(!!result) setIsUnsaved(false);
            }
        }
        catch (error) {
            console.log("error on record insertion to db,", error);
        }
    }

    

    useEffect(()=>{
        if(!iDBConnection){
              (async () => {
              try {
                // Open DB and create store if not present
                const db = await openDB("TestCaseDB", 1);
                setIDBConnection(db);      
              } catch (err) {
                console.error("Failed to open/load DB:", err);
              }
            })();
            }
    },[]);

    const onSubmitingAIResponse = (jsonText) => {
        // default submit handler — you can override by passing a prop
        try {
            const parsed = JSON.parse(jsonText);
            // For demo we just log it
            // Replace this with API call, parsing, validation etc.
            // eslint-disable-next-line no-console
            console.log("Submitted JSON:", parsed);
            if(Array.isArray(parsed)){

                setListOfTestCasesData(prev => [...prev, ...parsed]);
                
                setIsUnsaved(true);
                
                alert("JSON submitted successfully — check console for output.");
            }

        } catch (e) {
            alert("Invalid JSON. Please paste a valid JSON object.");
        }
    }

    console.log("setOpenExitConfirmationDialog", openExitConfirmationDialog);
    return (
        // <div>{testCaseFileName}</div>
        <div className={`transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"} `}>
            <IsUnsavedContext.Provider value={{ isUnsaved, setIsUnsaved }} >

                <ClipboardContext.Provider value={{ clipboardTestCaseData, setClipboardTestCaseData }}>
                    <TopFoldNavSheet />

                    <div className="flex flex-col static">

                        <div className="flex justify-between text-2xl font-bold bg-white  text-left py-4 px-2 shadow-md z-30">
                            <div className="">Create Test Cases</div>
                            <div className="text-lg flex gap-5 me-10  ">
                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-600 text-white rounded-xl hover:from-gray-700 hover:to-gray-500 transition-all duration-200"
                                    onClick={() => setOpenDialog(prev => !prev)}
                                >
                                    <Brain className="w-5 h-5" />
                                    <span>Upload AI Response</span>
                                    <Upload className="w-4 h-4 opacity-80" />
                                </button>
                                <button className="px-3 py-1.5 rounded-md bg-gray-500 hover:bg-black text-white text-xl" onClick={() => {
                                    setFading(true); // trigger CSS fade
                                    setTimeout(() => navigate("/preview"), 300);
                                    saveOnIndexedDBFunc();
                                }}> Save & Preview</button>
                                <button className="px-3 py-1.5 rounded-md bg-white border-2 border-slate-500 border text-black hover:bg-black hover:text-white hover:text-white text-xl"
                                    onClick={() => {
                                        saveOnIndexedDBFunc();
                                        setFading(true); // trigger CSS fade
                                        setTimeout(() => navigate(-1), 300);
                                    }}>
                                    Save & Exit
                                </button>
                                <button className="px-3 py-1.5 rounded-md bg-white border-2 border-slate-500 border text-black hover:bg-black hover:text-white hover:text-white text-xl"
                                    onClick={() => {
                                        if (!isUnsaved) {
                                            setFading(true);
                                            setTimeout(() => navigate(-1), 300);
                                            return null; // or some fallback JSX
                                        }


                                        setOpenExitConfirmationDialog(true)
                                    }}>
                                    Exit
                                </button>
                            </div>
                        </div>


                        <div className="grid grid-cols-12   ">
                            <div className="min-h-dvh col-span-7 bg-white p-6    border border-r-gray-300 z-20 rounded-3 rounded">
                                <LeftMain />
                            </div>
                            <div className="col-span-5  bg-slate-50 pb-2 max-h-screen overflow-y-auto overflow-x-hidden custom-scrollbar z-20 ">
                                <RightMain />
                            </div>
                        </div>
                    </div>

                    <PromptJsonDialog open={openDialog} onClose={() => setOpenDialog(prev => !prev)} onSubmit={(jsonText) => onSubmitingAIResponse(jsonText)} />



                    {(openExitConfirmationDialog && isUnsaved) && <ExitConfirmationDialog onGoHome={() => {
                        setFading(true); // trigger CSS fade
                        setTimeout(() => navigate(-1), 300);
                        setOpenExitConfirmationDialog(false);
                    }} onStay={() => setOpenExitConfirmationDialog(false)} />}

                </ClipboardContext.Provider>
            </IsUnsavedContext.Provider>
        </div>
    )
}