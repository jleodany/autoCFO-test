onmessage = (message) => {
  const { data } = message;
  
  const rows = data.split('\r\n').filter(item => item).map(row => {
    return row.split(',').map(rowItem => rowItem.trim());
  });

  const sums = {};
  const lastRowNumber = rows.length;

  rows.map((rowItem, rowIndex) => {
    const objectToRender = {
      rowIndex: null,
      columns: [],
    };

    objectToRender['rowIndex'] = rowIndex;

    rowItem.map((columnItem, columnIndex) => {
      const value = isNaN(Number(columnItem)) || rowIndex === 0
        ? columnItem
        : Number(columnItem);
      
      objectToRender.columns.push({ columnIndex, value });
      if (rowIndex === 0 || columnIndex === 0) {
        return;
      }

      !sums[columnIndex] && (sums[columnIndex] = 0)
      !isNaN(parseFloat(columnItem)) 
        && (sums[columnIndex] = Number((sums[columnIndex] + Number(value.toFixed(3))).toFixed(3)));
    });
    postMessage(objectToRender);
  });

  const lastObjectToRender = {
    rowIndex: lastRowNumber,
    columns: [],
  };

  // const lastRow = table.insertRow(lastRowNumber);
  lastObjectToRender.columns.push({
    columnIndex: 0,
    value: 'TOTAL',
  });

  for (const key in sums) {
    const columnIndex = key;
    const value = sums[key];
    console.log(columnIndex, value)
    lastObjectToRender.columns.push({ columnIndex, value });
  }
  postMessage(lastObjectToRender);
  console.log(message);
}