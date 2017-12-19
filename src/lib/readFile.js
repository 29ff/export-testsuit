import XLSX from "xlsx";

const readFile = (files, cb) => {
  let reader = FileReader();
  reader.onload = () => {
    let {
      Sheets     : sheets,
      SheetNames : sheetNames,
      SheetNames : [tabToParse]
    } = XLSX.read(reader.result, {type: 'binary'})
  }
};
