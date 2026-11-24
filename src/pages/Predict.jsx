import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PredictionForm } from '../components/PredictionForm';
import { PredictionResult } from '../components/PredictionResult';
import { predictMarketValue } from '../services/api';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import playersData from '../data/playersData.json';
import './Predict.css';

export function Predict() {
  const location = useLocation();
  const navigate = useNavigate();

  const [initialPlayer, setInitialPlayer] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [submittedFormData, setSubmittedFormData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const playerQueryParam = params.get('player');

    if (location.state?.selectedPlayer) {
      setInitialPlayer(location.state.selectedPlayer);
    } else if (playerQueryParam) {
      const q = playerQueryParam.toLowerCase();
      const matched = playersData.find(p => p.name.toLowerCase() === q) ||
                      playersData.find(p => p.name.toLowerCase().includes(q));
      if (matched) {
        setInitialPlayer(matched);
      }
    } else if (location.state?.searchQuery) {
      const q = location.state.searchQuery.toLowerCase();
      const matched = playersData.find(p => p.name.toLowerCase().includes(q));
      if (matched) {
        setInitialPlayer(matched);
      }
    }
  }, [location.state, location.search]);

  const handleFormSubmit = async (formData) => {
    setStatus('submitting');
    setErrorMessage(null);
    setSubmittedFormData(formData);

    try {
      const apiResponse = await predictMarketValue(formData);
      setResult(apiResponse);
      setStatus('success');

      // Scroll smoothly to top of result
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Prediction failed:', err);
      setErrorMessage(err.message || 'Unable to calculate valuation. Please try again.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="predict-page section-padding">
      <div className="container">
        {/* Header Breadcrumb */}
        <div className="predict-header border-bottom-mist">
          <div>
            <span className="micro-label">VALUATION ENGINE</span>
            <h1 className="headline-hero predict-title">
              Player Valuation Engine
            </h1>
          </div>
          {status === 'success' && (
            <button onClick={handleReset} className="btn-secondary">
              <ArrowLeft size={15} /> Modify Inputs
            </button>
          )}
        </div>

        {/* API Error Block */}
        {status === 'error' && (
          <div className="editorial-error-block margin-top-md">
            <div className="error-icon-col">
              <AlertCircle size={22} className="error-icon" />
            </div>
            <div className="error-content-col">
              <h4 className="error-heading">Unable to calculate valuation</h4>
              <p className="error-detail">{errorMessage}</p>
              <button 
                onClick={() => handleFormSubmit(submittedFormData)} 
                className="btn-secondary btn-sm margin-top-xs"
              >
                <RefreshCw size={13} /> Retry calculation
              </button>
            </div>
          </div>
        )}

        {/* View Mode: Form or Result */}
        {status === 'success' ? (
          <div className="margin-top-lg">
            <PredictionResult 
              result={result} 
              formData={submittedFormData} 
              onReset={handleReset} 
            />
          </div>
        ) : (
          <div className="margin-top-lg">
            <PredictionForm 
              initialPlayer={initialPlayer}
              onSubmit={handleFormSubmit}
              isLoading={status === 'submitting'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
