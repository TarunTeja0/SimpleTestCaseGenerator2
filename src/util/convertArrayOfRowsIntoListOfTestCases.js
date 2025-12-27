import { EmptyFirstRowFieldsData, InitialFirstRowFieldsData } from "./temp";

export default function convertArrayOfRowsIntoListOfTestCases(arrayOfRows) {
    console.log("convertArrayOfRowsIntoListOfTestCases");
    const importedFileFirstRowFieldsData = EmptyFirstRowFieldsData();
    let testCaseCounter = 0;
    let importedTestCaseData;
    const importedListOfTestCasesData = [];
    arrayOfRows.forEach(
        (row, idx) => {
            //below condition is to check the first row of the test cases
            if (row["Work Item Type"].length !== 0) {
                
                //if testcasecounter zero aithey then importedtestcasedata object inka populate kaaledhu ani, if zero kakunte then testcasedraft object lo data unnatlu, so we can add it into listoftestcasedata
                if(testCaseCounter > 0){
                    importedListOfTestCasesData.push(importedTestCaseData);
                }


                //for every first row of a test case, we are setting a new empty object
                importedTestCaseData = {
                    testCaseIndex: ++testCaseCounter,
                    title: "",
                    expectedResult: "",
                    precondition: "",
                    steps: [],
                }
                //checking if it is first test case or not -> static values are same for all test cases so its okay to get those values from first test case main row
                if (idx === 0) {
                    staticFieldsMapperFrom_FirstRowObject_To_ImportedFileFirstRowFieldsData(importedFileFirstRowFieldsData, row);
                    ExtractTestCaseIdAndScenarioIdWithoutSequence_From_FirstRowObject_To_ImportedFileFirstRowFieldsData(importedFileFirstRowFieldsData, row);
                }
                ExtractSegmentAndDeviceFromFirstRowObject_MapTo_ImportedFileFirstRowFieldsData(importedFileFirstRowFieldsData, row);
                
                extractDynamicValuesFromFirstRowObject_MapTo_ImportedListOfTestCasesData(importedTestCaseData, row);
                console.log(importedFileFirstRowFieldsData);

            }
            //if not first rows of test cases, then these are step rows
            else {
                extractStepsOfTestCasesFromStepRowObject_MapTo_ImportedTestCaseData(importedTestCaseData, row);
            }
        }
    )
    console.log(importedListOfTestCasesData);
    return [importedFileFirstRowFieldsData, importedListOfTestCasesData];

}

function staticFieldsMapperFrom_FirstRowObject_To_ImportedFileFirstRowFieldsData(importedFileFirstRowFieldsData, firstRow) {
    console.log("importedFileFirstRowFieldsData[\"Work Item Type\"][\"type\"]", importedFileFirstRowFieldsData["Work Item Type"]["type"]);
    console.log("firstRow", firstRow["Work Item Type"]);

    importedFileFirstRowFieldsData["Work Item Type"]["value"] = firstRow["Work Item Type"];
    importedFileFirstRowFieldsData["Custom.SprintNo"]["value"] = firstRow["Custom.SprintNo"];
    importedFileFirstRowFieldsData["Custom.UserStoryID"]["value"] = firstRow["Custom.UserStoryID"];
    importedFileFirstRowFieldsData["Area Path"]["value"] = firstRow["Area Path"];
    importedFileFirstRowFieldsData["Assigned To"]["value"] = firstRow["Assigned To"];
    importedFileFirstRowFieldsData["Custom.Environment"]["value"] = firstRow["Custom.Environment"];
    importedFileFirstRowFieldsData["State"]["value"] = firstRow["State"];
}

function ExtractSegmentAndDeviceFromFirstRowObject_MapTo_ImportedFileFirstRowFieldsData(importedFileFirstRowFieldsData, firstRow) {
    const prefix = firstRow["Title"].split(" ")[0];
    console.log(prefix);
    const [language, segment] = prefix.split("_");
    console.log("language", language); //no use
    console.log("segment", segment);

    const device = firstRow["Tags"];
    console.log("device", device);

    if (!importedFileFirstRowFieldsData["Tags"]["value"].toLowerCase().includes(device.toLowerCase())) {
        if (importedFileFirstRowFieldsData["Tags"]["value"].length !== 0) {
            importedFileFirstRowFieldsData["Tags"]["value"] += ", " + device;
        }
        else {
            importedFileFirstRowFieldsData["Tags"]["value"] = device;
        }
    }

    if (!importedFileFirstRowFieldsData["Custom.UserRole"]["value"].toLowerCase().includes(segment.toLowerCase())) {
        if (importedFileFirstRowFieldsData["Custom.UserRole"]["value"].length !== 0) {
            importedFileFirstRowFieldsData["Custom.UserRole"]["value"] += ", " + segment;
        }
        else {
            importedFileFirstRowFieldsData["Custom.UserRole"]["value"] = segment;
        }
    }
}

function ExtractTestCaseIdAndScenarioIdWithoutSequence_From_FirstRowObject_To_ImportedFileFirstRowFieldsData(importedFileFirstRowFieldsData, firstRow) {
    let testCaseId = firstRow["Custom.TestCaseID"];
    let testCaseIdWithoutSequence;
    for (let i = testCaseId.length - 1; i > -1; i--) {
        let char = testCaseId.charAt(i);
        if (!(char >= "0" && char <= "9")) {
            testCaseIdWithoutSequence = testCaseId.substring(0, i + 1);
            break;
        }
    }
    importedFileFirstRowFieldsData["Custom.TestCaseID"]["value"] = testCaseIdWithoutSequence;

    let scenarioID = firstRow["Custom.ScenarioID"];
    let scenarioIdWithoutSequence;
    for (let i = scenarioID.length - 1; i > -1; i--) {
        let char = scenarioID.charAt(i);
        if (!(char >= "0" && char <= "9")) {
            scenarioIdWithoutSequence = scenarioID.substring(0, i + 1);
            break;
        }
    }
    importedFileFirstRowFieldsData["Custom.ScenarioID"]["value"] = scenarioIdWithoutSequence;
}

function extractDynamicValuesFromFirstRowObject_MapTo_ImportedListOfTestCasesData(importedTestCaseData, row){
    // console.log(row["Title"]);
    const testCaseTitle = row["Title"];
    const testCaseTitleWithoutPrefix = testCaseTitle.substring(testCaseTitle.indexOf(" ")+1, testCaseTitle.length);
    importedTestCaseData["title"] = testCaseTitleWithoutPrefix;
    importedTestCaseData["expectedResult"] = row["Custom.ExpectedResult"];
    importedTestCaseData["precondition"] = row["Custom.Precondition"];

    console.log(importedTestCaseData);
    


}

function extractStepsOfTestCasesFromStepRowObject_MapTo_ImportedTestCaseData(importedTestCaseData, row){
    const StepNumber = row["Test Step"];
    const StepAction = row["Step Action"];
    const StepExpectedResult = row["Step Expected"];

    importedTestCaseData["steps"].push({ StepNumber , StepAction, StepExpectedResult});
}