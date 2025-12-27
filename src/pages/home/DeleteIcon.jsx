import { useContext, useState } from "react";
import { IDBContext } from "../../App";
import { deleteFileFromIndexedDb } from "../../util/dbUtil";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const DeleteIcon = ({ setShowDialog }) => {
    const { iDBConnection } = useContext(IDBContext);
    // const [showDialog, setShowDialog] = useState(false);
    // const onDeleteFile = async (e) => {

    //     e.stopPropagation(); //to prevent triggering onClick of parent element

    //     console.log("deleting file:", fileName);

    //     const isFileDeletedFromTestCaseFileMetadata = await deleteFileFromIndexedDb(iDBConnection, "testCaseFileMetadata", fileName);
    //     //here we are checking if the file is deleted from testCaseFileMetadata store, if yes then we are deleting it from testCaseData store
    //     if (isFileDeletedFromTestCaseFileMetadata) {
    //         const isFileDeletedFromTestCaseData = await deleteFileFromIndexedDb(iDBConnection, "testCaseData", fileName);
    //         //here we are checking if the file is deleted from testCaseData store
    //         if (isFileDeletedFromTestCaseData) {
    //             console.log("file deleted successfully");
    //             window.location.reload();
    //         }
    //     }
    // }

    // const onCancel = (e) => {
    //     e.stopPropagation();
    //     setShowDialog(false);
    // }


    return (
        <>
            {/* {showDialog ? */}
                {/* <DeleteConfirmationDialog onDeleteFile={onDeleteFile} onCancel={onCancel} /> */}
                {/* <h2>delete</h2> */}
                {/* : */}
                <>
                    <div class="
                        absolute top-0 right-0
                        w-0 h-0
                        border-t-[50px] border-l-[50px] border-l-transparent
                        
                        border-r-0
                        ">
                    </div>
                    <button class="absolute -top-3 -right-3 translate-x-[-15px] translate-y-[15px] text-red-500  z-10" onClick={(e => {
                        e.stopPropagation(); //to prevent triggering onClick of parent element
                        setShowDialog(true);
                    })}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400 hover:text-red-700" viewBox="0 0 24 24" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 3a1 1 0 00-1 1v1H4a1 1 0 100 2h1v11a2 2 0 002 2h10a2 2 0 002-2V7h1a1 1 0 100-2h-4V4a1 1 0 00-1-1H9zm2 4a1 1 0 112 0v8a1 1 0 11-2 0V7zm-4 0a1 1 0 012 0v8a1 1 0 11-2 0V7z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </>

            {/* } */}
        </>
    )
}

export default DeleteIcon;