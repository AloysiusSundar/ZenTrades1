import React, { useState, useEffect } from 'react';
import './styles.css';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://s3.amazonaws.com/open-to-cors/assignment.json");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div>
      <h1>Product Data - Joy Aloysius</h1>
      {data ? (
        <ul>
          {Object.keys(data.products).map((productId) => {
            const product = data.products[productId];
            return (
              <li key={productId}>
                <h2>{product.title}</h2>
                <p>Subcategory: {product.subcategory}</p>
                <p>Price: {product.price}</p>
                <p>Popularity: {product.popularity}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Working On It</p>
      )}
    </div>
  );
};

export default App;