import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import { IDBContext, TestCaseFileNameContext } from "../../App";
import DeleteTestCaseCard from "./DeleteIcon";
import DeleteIcon from "./DeleteIcon";
import { deleteFileFromIndexedDb, updateFileNameInIndexedDb } from "../../util/dbUtil";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import RenameIcon from "./RenameIcon";
import Dialog from "./Dialog";

export default function HomeTestCaseCard({ f, setFading }) {
  const navigate = useNavigate();
  const { saveTestCaseFileNameFunc } = useContext(TestCaseFileNameContext);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const { iDBConnection } = useContext(IDBContext);


  const onClick = (e) => {
    console.log(e.target);
    console.log("inside onClick of test case card:", f.fileName);
    e.stopPropagation();
    saveTestCaseFileNameFunc(f.fileName);
    setFading();
    setTimeout(() => navigate("/create?filename=" + f.fileName), 400);

  }

  const onDeleteFile = async (e) => {

    e.stopPropagation(); //to prevent triggering onClick of parent element

    console.log("deleting file:", f.fileName);

    const isFileDeletedFromTestCaseFileMetadata = await deleteFileFromIndexedDb(iDBConnection, "testCaseFileMetadata", f.fileName);
    //here we are checking if the file is deleted from testCaseFileMetadata store, if yes then we are deleting it from testCaseData store
    if (isFileDeletedFromTestCaseFileMetadata) {
      const isFileDeletedFromTestCaseData = await deleteFileFromIndexedDb(iDBConnection, "testCaseData", f.fileName);
      //here we are checking if the file is deleted from testCaseData store
      if (isFileDeletedFromTestCaseData) {
        console.log("file deleted successfully");
        window.location.reload();
      }
    }
  }

  const onCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(false);
  }

  const onRenameHandler = async (newFileName) => {
    console.log("renaming file:", f.fileName, "to", newFileName);
    const isFileNameUpdatedInMetadataStore = await updateFileNameInIndexedDb(iDBConnection, "testCaseFileMetadata", f.fileName, newFileName);
    if(isFileNameUpdatedInMetadataStore){
      const isFileNameUpdatedInTestCasesStore = await updateFileNameInIndexedDb(iDBConnection, "testCaseData", f.fileName, newFileName);
      if(isFileNameUpdatedInTestCasesStore){
        console.log("file renamed successfully");
        window.location.reload();
      }
    }
    else{
      console.log("file rename failed");
    }
  }
  return (
    <>

      {/* //  <div className="bg-white rounded-xl shadow-md p-6 hover:scale-[1.02] transition-transform"

    //           style={{
    //             border: "1px solid #ddd",
    //             padding: 12,
    //             borderRadius: 8,
    //             boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    //             background: "#fff",
    //           }}
    //         >
    //           <div style={{ fontWeight: 600 }}>{f.fileName}</div>
    //           <div style={{ color: "#666", fontSize: 13 }}>
    //             Created: {new Date(f.createdOn).toLocaleString()}
    //           </div>
    //         </div>

    //   <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> */}

      {showDeleteDialog && <DeleteConfirmationDialog onDeleteFile={onDeleteFile} onCancel={onCancelDelete} />}

      {showRenameDialog && <Dialog open={showRenameDialog} onClose={() => setShowRenameDialog(false)} onRename={(newFileName) => { onRenameHandler(newFileName) }} title="Rename File" newOrRename="rename" initialFileName={f.fileName} />}

        <div onClick={onClick}> 
          <div
            key={f.fileName}
            className="bg-white rounded-xl shadow-md p-6 hover:scale-[1.02] transition-transform relative"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-700 pt-2">
              {f.fileName}
            </h3>
            <p className="text-gray-700"><span className="font-medium">Modified on: </span>{new Date(f.modifiedOn).toLocaleString()}</p>

            {/* <div>Delete</div> */}
            <DeleteIcon setShowDialog={setShowDeleteDialog} />

            <RenameIcon setShowDialog={setShowRenameDialog} />

          </div>


        </div>
    </>
  )
}