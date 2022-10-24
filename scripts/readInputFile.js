const calculateTotalsWorker = new Worker('workers/calculateTotals.js')

const table = document.querySelector("#dataTable");
const fileUploadInput = document.querySelector('#fileUpload');

fileUploadInput.addEventListener('input', (event) => {
  const files = event.target.files;
  const file = files[0];
  const fr = new FileReader();
  fr.onload = onLoadedFile;
  fr.readAsText(file);
});

const onLoadedFile = (loadedFile) => {
  const { result } = loadedFile.target;

  calculateTotalsWorker.postMessage(result);
};

/**
 * 
 * The logic could be different here, instead of receiving the data for a whole row
 * it could receive individual columns, with an flag of which row it belongs to and
 * which position it will have in that row.
 * But i could not find whether what's the best practice in this case so, for this test,
 * i took this approach.
 */
calculateTotalsWorker.onmessage = (message) => {
  const { data } = message;

  const row = table.insertRow(data.rowIndex);
  data.columns.map(column => {
    const { value, columnIndex } = column

    const cell = row.insertCell(columnIndex);
    cell.innerHTML = `<div class="cellDiv">${value}</div>`;
  });
}