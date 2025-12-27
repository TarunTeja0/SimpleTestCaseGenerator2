import * as XLSX from "xlsx";
export default function excelReader(file){
    return new Promise((resolve, reject) => {

        const reader = new FileReader();
        
        reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            console.log("binaryStr: ", arrayBuffer)
            
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            
            const sheetName = workbook.SheetNames[0]; // first sheet
            const sheet = workbook.Sheets[sheetName];
            
            const data = XLSX.utils.sheet_to_json(sheet, {
                defval: ""
            });
            
            console.log("data:", data);
            resolve(data); // send data to parent
        };

        reader.onerror = reject;
        
        reader.readAsArrayBuffer(file);
    });
}