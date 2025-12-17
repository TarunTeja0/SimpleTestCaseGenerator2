import { useContext, useEffect, useRef } from "react";
import TestCaseCard from "./TestCaseCard";
import { ListOfTestCasesDataContext } from "../../App";
import { ClipboardContext, IsUnsavedContext } from "./Create";
import cloneDeep from 'lodash/cloneDeep';
import { closestCorners, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function RightMain() {
    const { listOfTestCasesData, setListOfTestCasesData } = useContext(ListOfTestCasesDataContext);

    const containerRef = useRef(null);
    const prevContainerLengthRef = useRef(listOfTestCasesData?.length);

    const { isUnsaved, setIsUnsaved } = useContext(IsUnsavedContext);


    const { clipboardTestCaseData, setClipboardTestCaseData } = useContext(ClipboardContext);
    console.log("clipboad", clipboardTestCaseData);
    useEffect(() => {
        const c = containerRef.current;
        if (!c) return;

        const prevLength = prevContainerLengthRef.current;
        const currLength = listOfTestCasesData?.length;

        if (currLength > prevLength) {
            // ensure DOM painted before scrolling
            requestAnimationFrame(() => {
                c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
            });
        }
        prevContainerLengthRef.current = currLength;
    }, [listOfTestCasesData?.length]);

    const onDelete = (testCaseNum) => {
        let newTCsDataList = [];
        setListOfTestCasesData(prev => {
            newTCsDataList = prev.filter((_, idx) => {
                return idx !== testCaseNum;
            })
            setIsUnsaved(true);
            return newTCsDataList;
        })
    }

    const onCopy = (testCaseNum) => {
        const copy = cloneDeep(listOfTestCasesData[testCaseNum]);
        copy.testCaseIndex = "";
        console.log("is it original", copy == listOfTestCasesData[testCaseNum])
        setClipboardTestCaseData(copy);

    }

    const onEdit = (testCaseNum) => {
        const copy = cloneDeep(listOfTestCasesData[testCaseNum]);
        console.log("is it original", copy == listOfTestCasesData[testCaseNum])
        setClipboardTestCaseData(copy);

    }

    const getTaskPos = (id) => listOfTestCasesData.findIndex(tc => tc.testCaseIndex === id);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        console.log("active", active.id, "over", over.id);

        if (active.id === over.id) return;

        setListOfTestCasesData((prevTCList => {
            const originalPos = getTaskPos(active.id);
            const newPos = getTaskPos(over.id);


            const newListOfTestCases = arrayMove(prevTCList, originalPos, newPos);
            console.log({ newListOfTestCases });
            const reIndexingTestCasesIndex = newListOfTestCases.map((tc, idx) => {
                return {
                    ...tc,
                    testCaseIndex: idx + 1, 
                }
            });

            return reIndexingTestCasesIndex;
        }))
    }

    const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  })
)

    return (
        <div ref={containerRef} className="overflow-y-auto overflow-x-hidden max-h-full">

            {/* {(listOfTestCasesData && listOfTestCasesData?.length !== 0) && listOfTestCasesData?.map((testCaseData, idx) => {
                            console.log("inside return", listOfTestCasesData)
                            return <TestCaseCard key={testCaseData.testCaseIndex} testCaseData={testCaseData} testCaseNum={idx} onDelete={(testCaseNum) => onDelete(testCaseNum)} onCopy={(testCaseNum) => onCopy(testCaseNum)} onEdit={(testCaseNum) => onEdit(testCaseNum)} />
                        })} */}

            {(listOfTestCasesData && listOfTestCasesData?.length !== 0) && <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners} sensors={sensors}>
                <SortableContext items={listOfTestCasesData.map(tc => tc.testCaseIndex)} strategy={verticalListSortingStrategy}>
                    {
                        listOfTestCasesData?.map((testCaseData, idx) => {
                            console.log("inside return", listOfTestCasesData)
                            return <TestCaseCard key={testCaseData.testCaseIndex} testCaseIndex={testCaseData.testCaseIndex} testCaseData={testCaseData} testCaseNum={idx} onDelete={(testCaseNum) => onDelete(testCaseNum)} onCopy={(testCaseNum) => onCopy(testCaseNum)} onEdit={(testCaseNum) => onEdit(testCaseNum)} />
                        })}
                </SortableContext>
            </DndContext>
            }

            {
                (listOfTestCasesData && listOfTestCasesData?.length == 0) &&
                <div className="text-center text-lg text-slate-400 "> No test case created yet. </div>
            }

            {/* <TestCaseCard />
          <TestCaseCard />  */}
        </div>
    )
}