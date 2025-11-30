import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/RecommendationButton.css';

const FloatingRecommendationButton = () => {
    const navigate = useNavigate();

    return (
        <div className="frb-container">
            <button
                type="button"
                aria-label="Ir a Recomendaciones IA"
                title="Recomendaciones IA"
                className="frb-button"
                onClick={() => navigate('/recomendaciones')}
            >
                <i className="bi bi-robot"></i>
            </button>

        </div>
    );
};

export default FloatingRecommendationButton;
