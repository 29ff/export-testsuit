import moment from 'moment';

function fetchResults(fileData, fileName) {
  const validateCode = [200, 201];
  const data = ['Actual test name', 'Pass/Fail (P/F)', 'Dates', 'Comments', '\n', '', '', ''];
  const currentDate = moment().format('DD-MMM-YY');
  const obj = JSON.parse(JSON.stringify(fileData));
  if (obj.results) {
    obj.results.forEach((item) => {
      const caseData = [`\n${item.name}`];
      if (item.responseCode.code) {
        if (validateCode.includes(item.responseCode.code)) {
          const testsName = Object.keys(item.tests);
          const testsLength = testsName.length;
          const testPassFailCounts = item.testPassFailCounts;
          if (testsLength > 0) {
            let isPass = false;
            testsName.forEach((status) => {
              if (testPassFailCounts[status].pass === 1) {
                isPass = true;
              }
            });
            (isPass) ? caseData.push('P', currentDate, '') : caseData.push('F', currentDate, '')
          } else {
            caseData.push('F', currentDate, 'No test found');
          }
        } else {
          caseData.push('F', currentDate, '');
        }
      }
      data.push(...caseData);
    });
  } else {
    console.log('Cannot render file imported, please re-export and try again!.')
  }
  downloadExcel(fileName, data);
}

function downloadExcel(excelName, data) {
  const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  let blobURL = window.URL.createObjectURL(blob);
  let tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobURL
  tempLink.setAttribute('download', `${excelName}.xlsx`)
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  window.URL.revokeObjectURL(blobURL)
}

export {fetchResults}
