import React from 'react';

const ResultPage = ({ selectedData }) => {
  return (
    <div>
      <h2>Selected Data</h2>
      <ul>
        {Object.entries(selectedData).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultPage;
