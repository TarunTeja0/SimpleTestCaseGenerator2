// export function HeaderarrayToReactSpreadsheetRow(headerArr){
//     return headerArr.map(h => ({ value: h }));
// }
export function HeaderarrayToReactSpreadsheetRow(firstRowFields){
    const emptyRow = [...Array(27)].map(() => ({}));

    Object.entries(firstRowFields).map(([fieldName, fieldObj]) =>{
        emptyRow[fieldObj.index] ={value: fieldName};
        return null;
    })

    return emptyRow;

}

export function firstRowJsonToReactSpreadsheetRow(headerArr, firstRowFields){
    const emptyRow = [...Array(27)].map(() => ({}));

    Object.entries(firstRowFields).map(([fieldName, fieldObj]) => {
        if(fieldObj.type === "STATIC" || fieldObj.type === "PREFIX+SEQUENCE" || fieldObj.type === "CATEGORICAL")
            emptyRow[fieldObj.index] = {value : fieldObj.value+"Random"}
            return null; 
        })

        return emptyRow;

    // const firstRow = HeaderarrayToReactSpreadsheetRow(headerArr);

    // Object.keys(headerArr).map((fieldName, idx)=>{
    //     if(staticFields[fieldName] === undefined){
    //         return firstRow[idx] = {}
    //     }
    //     // const fieldIndex = headerArr.indexOf(fieldName);
    //     firstRow[idx].value = staticFields[fieldName];
    // })
    // return firstRow;
}

export function testCaseRowsGenerator(firstRowFields, testCaseData){
    // const 

    const firstRowCellValues = firstRowGenerator(firstRowFields, testCaseData);

    const stepRowsCellValues = stepRowsGenerator(3, 4, 5, testCaseData);

    console.log("data for one test case", [firstRowCellValues, ...stepRowsCellValues]);

    return [firstRowCellValues, ...stepRowsCellValues];  

    // return [
    //     [{},{},{}],
    //     [{},{},{}]
    // ]
}

export function firstRowGenerator(firstRowFields, testCaseData){
    const newRow = [...Array(27)].map(() => ({}));

    Object.entries(firstRowFields).map(([fieldName, fieldObj]) => {
        if(fieldObj.type === "STATIC"){
            newRow[fieldObj.index] = {value : fieldObj.value}
        }
        else if(fieldObj.type === "PREFIX+SEQUENCE"){
            newRow[fieldObj.index] = {value: fieldObj.value+formatNumber(testCaseData.testCaseIndex)}
        }
        else if(fieldObj.type === "DYNAMIC"){
            if(fieldName === "Title"){
                newRow[fieldObj.index] = {value: testCaseData.title}
            }
            else if(fieldName === "Custom.ExpectedResult"){
                newRow[fieldObj.index] = {value: testCaseData.expectedResult}
            }
            else if(  fieldName === "Custom.Precondition"){
                newRow[fieldObj.index] = {value: testCaseData.precondition}
            }
        }
        else if(fieldObj.type === "CATEGORICAL"){
           //do nothing  
        }
        return null; 
        })
    return newRow;
}

export function stepRowsGenerator(stepNumFieldIndex, stepActionFieldIndex, StepExpectedFieldIndex, testCaseData){
    return testCaseData.steps.map(({ StepNumber, StepAction, StepExpectedResult})=>{
            const newStepRow = [...Array(27)].map(() => ({}));
            newStepRow[stepNumFieldIndex] = {value: StepNumber};
            newStepRow[stepActionFieldIndex] = {value: StepAction};
            newStepRow[StepExpectedFieldIndex] = {value: StepExpectedResult};
            return newStepRow;
        })
}

function formatNumber(n) {
  if (n < 10) return String(n).padStart(3, "0");  // 1 digit → 3 chars with zeros
  if (n < 100) return String(n).padStart(3, "0"); // 2 digits → still 3 chars
  return String(n); // 3 or more digits → no change
}

export function duplicateTestCasesBySegmentsAndTags(arrayOfRows, segments, tags, Lodash){
    const segmentList = parseSegmentsStringIntoArray(segments);
    const tagList = parseTagsStringIntoArray(tags);
    const arrayOfRowsDuplicatedBySegmentsAndTags = [];

    // segmentList?.map((segment)=>{
    //     console.log(103)
    //     tagList.map(tag=>{
    //         arrayOfRowsDuplicatedBySegmentsAndTags.push(...addSegmentSpecificSegmentStringsToTestCases(arrayOfRows, segment, "EN_", tag, Lodash));
    //         console.log("arrayOfRowsDuplicatedBySegmentsAndTags-"+segment, arrayOfRowsDuplicatedBySegmentsAndTags);

    //     })
    // })

    tagList?.map((tag)=>{
        console.log(103)
        segmentList.map(segment=>{
            arrayOfRowsDuplicatedBySegmentsAndTags.push(...addSegmentSpecificSegmentStringsToTestCases(arrayOfRows, segment, "EN_", tag, Lodash));
            console.log("arrayOfRowsDuplicatedBySegmentsAndTags-"+segment, arrayOfRowsDuplicatedBySegmentsAndTags);

        })
    })
    
    // const arrayOfRowsDuplicatedBySegmentsAndTagsAndTags = 
    
    arrayOfRowsDuplicatedBySegmentsAndTags.push(...addSegmentSpecificSegmentStringsToTestCases(arrayOfRows, segmentList[0], "AR_", tagList[0], Lodash));
    
    console.log("arrayOfRowsDuplicatedBySegmentsAndTags-"+"AR_Personal", arrayOfRowsDuplicatedBySegmentsAndTags);
    
    return arrayOfRowsDuplicatedBySegmentsAndTags

}

function addSegmentSpecificSegmentStringsToTestCases(arrayOfRows, segment, lang, tag, Lodash){
    const copyArrayOfRows = Lodash.cloneDeep(arrayOfRows);
    const titlePrefix = lang+segment+"_Verify";
    const userRole = segment + " user";

    // const dynamicFieldsIndexes = {}
    copyArrayOfRows.map(row =>{
        //checking if row has value at index 2 (i.e., title column place), if it is not undefined, then it means it has value, it means that row is the first row in the test case
        if(!(row[2].value === undefined)){
            row[2].value = titlePrefix+ " " + row[2].value;
            row[20].value = userRole;
            row[26].value = tag
            console.log("title", row[2]);
            console.log("userrole", row[20]);
        }
        return null;
    } )

    return copyArrayOfRows;

}

// function addSegmentSpecificTagStringToTestCases(){

// }

function parseSegmentsStringIntoArray(segments){
    console.log("segments",segments);
    const segmentsList = segments.trim().split(",").map(segment=> segment.trim());
    console.log(segmentsList);
    return segmentsList;
}

function parseTagsStringIntoArray(tags){
    console.log("tags",tags);
    const tagList = tags.trim().split(",").map(tag=> tag.trim());
    console.log(tagList);
    return tagList;
}

export function downloadExcel(data,  XLSX) {
  // 1. Convert spreadsheet data → plain 2D array
  if(data){

      const aoa = data?.map(row => row.map(cell => cell?.value ?? ""));
      
      // 2. Convert to worksheet
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      
      // 3. Create workbook and append sheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      
      // 4. Trigger browser download
      XLSX.writeFile(wb, "testcases.xlsx");
    }
}