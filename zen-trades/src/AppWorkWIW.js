import React, { useState } from 'react';
import Papa from 'papaparse';
import './DataViewer.css'; 

const DataViewer = () => {
  const [file, setFile] = useState(null);
  const [delimiter, setDelimiter] = useState(',');
  const [encoding, setEncoding] = useState('UTF-8');
  const [fileType, setFileType] = useState('CSV');
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      if (selectedFile.type === 'application/json') {
        parseJsonFile(selectedFile);
      } else if (selectedFile.type === 'text/csv') {
        parseCsvFile(selectedFile);
      }
    }
  };

  const parseJsonFile = (jsonFile) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonData = JSON.parse(event.target.result);

      const productsData = jsonData.products || {};

      const columns = Object.keys(productsData[Object.keys(productsData)[0]]) || [];

      setAvailableColumns(columns);
    };
    reader.readAsText(jsonFile);
  };

  const parseCsvFile = (csvFile) => {
    Papa.parse(csvFile, {
      complete: (result) => {
        const columns = result.meta.fields || [];
        setAvailableColumns(columns);
      },
      header: true,
      delimiter: delimiter,
    });
  };

  const handleDelimiterChange = (e) => {
    setDelimiter(e.target.value);
    if (file && file.type === 'text/csv') {
      parseCsvFile(file);
    }
  };

  const handleEncodingChange = (e) => {
    setEncoding(e.target.value);
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleColumnClick = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter((col) => col !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);

    if (file) {
      if (file.type === 'application/json') {
        processJsonData();
      } else if (file.type === 'text/csv') {
        processCsvData();
      }
    }
  };

  const processJsonData = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonData = JSON.parse(event.target.result);

      const selectedData = Object.keys(jsonData.products).map((productId) => {
        const product = jsonData.products[productId];
        const selectedValues = {};
        selectedColumns.forEach((col) => {
          selectedValues[col] = product[col];
        });
        return selectedValues;
      });

      setSelectedData(selectedData);
    };
    reader.readAsText(file);
  };

  const processCsvData = () => {
    Papa.parse(file, {
      complete: (result) => {
        const selectedData = result.data.map((row) => {
          const selectedValues = {};
          selectedColumns.forEach((col) => {
            selectedValues[col] = row[col];
          });
          return selectedValues;
        });

        setSelectedData(selectedData);
      },
      header: true,
      delimiter: delimiter,
    });
  };

  const handleBack = () => {
    setConfirmed(false);
    setSelectedData(null);
  };

  const handleCancel = () => {
    setFile(null);
    setConfirmed(false);
    setSelectedData(null);
  };

  return (
    <div className="data-viewer-container">
      <div className="header-section">
        <h2>Joy Aloysius</h2>
        <img src='/assets/test.jpg' />
      </div>

      {!confirmed && (
        <>
          <div className="flex-container">
            <div className="upload-section">
              <h3>Step 1: Select File</h3>
              <label>
                Choose a file:
                <input type="file" onChange={handleFileChange} />
              </label>
            </div>

            <div className="delimiter-section">
              <h3>Step 2: Specify Format</h3>
              <label>
                Delimiter:
                <input
                  type="text"
                  value={delimiter}
                  onChange={handleDelimiterChange}
                />
              </label>
              <label>
                Character Encoding:
                <input
                  type="text"
                  value={encoding}
                  onChange={handleEncodingChange}
                />
              </label>
              <label>
                File Type:
                <input
                  type="text"
                  value={fileType}
                  onChange={handleFileTypeChange}
                />
              </label>
            </div>
          </div>

          <div className="flex-container">
            <div className="column-section">
              <h3>Step 3: Display Handling</h3>
              <div>
                <h4>Available Fields:</h4>
                <ul>
                  {availableColumns.map((col) => (
                    <li key={col} onClick={() => handleColumnClick(col)}>
                      {col}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="column-section">
              <h4>Fields to be Displayed:</h4>
              <ul>
                {selectedColumns.map((col) => (
                  <li key={col} onClick={() => handleColumnClick(col)}>
                    {col}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="button-section">
            {file && (
              <button onClick={handleConfirm}>Next</button>
            )}

            {file && (
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </>
      )}

      {confirmed && selectedData && (
        <div className="result-section">
          <button onClick={handleBack}>Back</button>
          <h3>Selected Data:</h3>
          <ul>
            {selectedData.map((data, index) => (
              <li key={index}>
                {Object.keys(data).map((key) => (
                  <p key={key}>
                    <strong>{key}:</strong> {data[key]}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

};


export default DataViewer;