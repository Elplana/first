const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Predicts a football player's market value by calling backend FastAPI.
 * @param {Object} payload Player metrics & features payload
 * @returns {Promise<{predicted_market_value_euros: number, formatted_market_value: string, status: string}>}
 */
export async function predictMarketValue(payload) {
  const url = `${API_BASE_URL}/api/v1/predict`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMsg = 'Failed to fetch valuation prediction from API.';
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMsg = errorData.detail.map(err => `${err.loc?.join(' -> ')}: ${err.msg}`).join('; ');
          } else {
            errorMsg = errorData.detail;
          }
        }
      } catch (e) {
        // Fall back to HTTP status text
        errorMsg = `Server error (${response.status}: ${response.statusText})`;
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Prediction API call error:', error);
    throw error;
  }
}

/**
 * Checks backend API status.
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn('Backend health check failed:', e);
  }
  return { status: 'offline', model_loaded: false };
}
