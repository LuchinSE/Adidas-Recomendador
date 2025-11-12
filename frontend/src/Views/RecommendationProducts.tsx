import React from 'react';
import { useState} from 'react';

const RecommendationProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://localhost:8080/api/recommendations');
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }

    }
}


export default RecommendationProduct;
