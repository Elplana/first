import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { PredictionResult } from '../components/PredictionResult';
import { ArrowLeft } from 'lucide-react';

export function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;
  const formData = location.state?.formData;

  if (!result || !formData) {
    return (
      <div className="section-padding text-center">
        <div className="container" style={{ maxWidth: '600px' }}>
          <span className="micro-label">NO ACTIVE VALUATION</span>
          <h2 className="section-title margin-top-sm">Select a player to generate a valuation</h2>
          <p className="margin-top-xs" style={{ color: 'var(--color-steel)' }}>
            To calculate an market value snapshot, please input performance metrics in the valuation engine.
          </p>
          <div className="margin-top-md">
            <Link to="/predict" className="btn-primary">
              <ArrowLeft size={15} /> Open Valuation Engine
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container">
        <div className="predict-header border-bottom-mist margin-bottom-lg">
          <div>
            <span className="micro-label">VALUATION REPORT</span>
            <h1 className="headline-hero predict-title">
              Player Valuation Result
            </h1>
          </div>
          <Link to="/predict" className="btn-secondary">
            <ArrowLeft size={15} /> Back to Engine
          </Link>
        </div>

        <PredictionResult
          result={result}
          formData={formData}
          onReset={() => navigate('/predict')}
        />
      </div>
    </div>
  );
}
