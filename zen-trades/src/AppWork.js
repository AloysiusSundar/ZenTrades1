import React, { useState, useEffect } from 'react';
import './jsonstyles.css'; 

const App = () => {
  const [data, setData] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const allFields = ['category', 'subcategory', 'title', 'price', 'popularity'];
  const [selectedFields, setSelectedFields] = useState([]);

  useEffect(() => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const result = JSON.parse(event.target.result);
          setData(result);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };

      reader.readAsText(uploadedFile);
    }
  }, [uploadedFile]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  const handleFieldClick = (field) => {

    setSelectedFields((prevSelectedFields) => {
      if (prevSelectedFields.includes(field)) {
        return prevSelectedFields.filter((selectedField) => selectedField !== field);
      } else {
        return [...prevSelectedFields, field];
      }
    });
  };

  return (
    <div className="container">
      <div className="file-upload-section">
        <h2>Select File</h2>
        <label className="file-upload-label">
          <span>Upload JSON file: </span>  
          <input type="file" accept=".json" onChange={handleFileUpload} /> 
          Supported File Type: .JSON
        </label>
      </div>

      <div className="fields-section">
        <div className="available-fields">
          <h2>Available Fields</h2>
          <ul>
            {allFields.map((field) => (
              <li
                key={field}
                onClick={() => handleFieldClick(field)}
                className={selectedFields.includes(field) ? 'selected' : ''}
              >
                {field}
              </li>
            ))}
          </ul>
        </div>

        <div className="selected-fields">
          <h2>Selected Fields</h2>
          <ul>
            {selectedFields.map((field) => (
              <li key={field} onClick={() => handleFieldClick(field)}>
                {field}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {data && (
        <div className="product-list">
          <h1>Product Data</h1>
          <ul>
            {Object.values(data.products).map((product) => (
              <li key={product.title}>
                {selectedFields.map((field) => (
                  <p key={field}>
                    {field}: {product[field]}
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

export default App;
