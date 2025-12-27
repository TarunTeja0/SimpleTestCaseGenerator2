import { useContext, useState } from "react";
import { IDBContext } from "../../App";
import { deleteFileFromIndexedDb } from "../../util/dbUtil";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { PencilIcon } from "lucide-react";

const RenameIcon = ({ setShowDialog }) => {
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
                        absolute top-0 left-0
                        w-0 h-0
                        border-b-[50px] border-b-transparent
                        border-l-[50px] 
                        z-30
                        ">
                    </div>
                    <button class="absolute -top-3 left-5 translate-x-[-15px] translate-y-[15px] text-blue-500 hover:text-blue-700 z-50 " onClick={(e => {
                        
                        e.stopPropagation(); //to prevent triggering onClick of parent element
                        setShowDialog(true);
                    })}>
                        <PencilIcon width={"1.5rem"} height={"1.5rem"}/>
                    </button>
                </>

            {/* } */}
        </>
    )
}

export default RenameIcon;