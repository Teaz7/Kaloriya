import React, { useMemo, useState, useEffect } from 'react';

export default function BMICalculator() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get user ID from localStorage (set during login)
  const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
  const USER_ID = userFromStorage.id;
  const API_URL = 'http://localhost:5000/api';
  
  console.log('User from localStorage:', userFromStorage);
  console.log('USER_ID:', USER_ID);
  
  // Colors from the screenshot
  const colors = {
    darkGreen: '#2F6F55',
    mediumGreen: '#3E8F70',
    lightGreen: '#CDEFD7',
    lighterGreen: '#EAF8EF',
    rangeUnder: '#A4E3B9',
    rangeNormal: '#BFEECF',
    rangeOver: '#CDE7A8',
    rangeObese: '#69A480',
    rangeExtreme: '#3F7E63',
    white: '#FFFFFF',
    grayText: '#6D7E72'
  };

  const radius = 12;

  const [tab, setTab] = useState('standard');
  const [gender, setGender] = useState('M');
  const [age, setAge] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/bmi/${USER_ID}`);
      if (!response.ok) throw new Error('Failed to load history');
      const data = await response.json();
      
      // Transform database data to match UI format
      const formattedHistory = data.map(item => ({
        value: parseFloat(item.bmi_value),
        status: getBMIStatus(item.bmi_value),
        timestamp: new Date(item.date_computed).getTime()
      }));
      
      setHistory(formattedHistory);
      setError(null);
    } catch (err) {
      setError('Failed to load history. Make sure the server is running.');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBMIStatus = (bmiValue) => {
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Overweight';
    if (bmiValue < 35) return 'Obese';
    return 'Extremely Obese';
  };

  const saveToDatabase = async (bmiValue, heightValue, weightValue) => {
    try {
      const payload = {
        user_id: USER_ID,
        bmi_value: parseFloat(bmiValue),
        height_used: parseFloat(heightValue),
        weight_used: parseFloat(weightValue),
      };
      
      console.log('Saving BMI with payload:', payload);
      
      const response = await fetch(`${API_URL}/bmi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to save BMI');
      }
      
      const data = await response.json();
      console.log('BMI saved successfully:', data);
      
      await loadHistory();
      setError(null);
    } catch (err) {
      setError(`Failed to save to database: ${err.message}`);
      console.error('Error saving BMI:', err);
    }
  };

  const result = useMemo(() => {
    if (bmi == null) return null;
    const status = getBMIStatus(bmi);
    return { bmi: bmi.toFixed(1), status };
  }, [bmi]);

  const calculate = () => {
    if (tab === 'standard') {
      const ft = parseFloat(heightFt);
      const lbs = parseFloat(weightLbs);
      if (!ft || !lbs) return setBmi(null);
      const inches = ft * 12;
      const bmiVal = (lbs / (inches * inches)) * 703;
      setBmi(bmiVal);
      saveToDatabase(bmiVal.toFixed(1), ft, lbs);
    } else {
      const cm = parseFloat(heightCm);
      const kg = parseFloat(weightKg);
      if (!cm || !kg) return setBmi(null);
      const m = cm / 100;
      const bmiVal = kg / (m * m);
      setBmi(bmiVal);
      saveToDatabase(bmiVal.toFixed(1), cm, kg);
    }
  };

  const clearForm = () => {
    setAge('');
    setGender('M');
    setHeightFt('');
    setHeightCm('');
    setWeightLbs('');
    setWeightKg('');
    setBmi(null);
  };

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      // Note: You might want to add a backend endpoint to delete all BMI records
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(diff / 604800000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  };

  const labelStyle = { color: colors.grayText, fontWeight: 600, marginBottom: 6 };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 10, fontFamily: 'system-ui, sans-serif' }}>
      <div>
        <h1 style={{ color: colors.darkGreen, letterSpacing: 1, fontSize: 36, marginBottom: 12 }}>
          BMI CALCULATOR
        </h1>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c00',
            padding: '12px',
            borderRadius: radius,
            marginBottom: 16,
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        <div
          style={{
            display: 'inline-flex',
            border: `1px solid ${colors.darkGreen}`,
            borderRadius: radius,
            overflow: 'hidden',
            marginBottom: 16
          }}
        >
          <button
            onClick={() => setTab('standard')}
            style={{
              padding: '10px 16px',
              background: tab === 'standard' ? colors.white : colors.lighterGreen,
              color: colors.darkGreen,
              border: 'none',
              borderRight: `1px solid ${colors.darkGreen}`,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Standard
          </button>
          <button
            onClick={() => setTab('metric')}
            style={{
              padding: '10px 16px',
              background: tab === 'metric' ? colors.white : colors.lighterGreen,
              color: colors.darkGreen,
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Metric
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 220px',
            gap: 16,
            alignItems: 'start'
          }}
        >
          <div
            style={{
              background: colors.lighterGreen,
              padding: 16,
              borderRadius: radius,
              border: `1px solid ${colors.lightGreen}`
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'grid' }}>
                <span style={labelStyle}>Age:</span>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder=""
                  style={{
                    padding: '10px 12px',
                    borderRadius: radius,
                    border: `1px solid ${colors.lightGreen}`,
                    background: colors.white
                  }}
                />
              </div>

              <div style={{ display: 'grid' }}>
                <span style={labelStyle}>Gender:</span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'M'}
                      onChange={() => setGender('M')}
                    />{' '}
                    M
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === 'F'}
                      onChange={() => setGender('F')}
                    />{' '}
                    F
                  </label>
                </div>
              </div>

              {tab === 'standard' ? (
                <>
                  <div style={{ display: 'grid' }}>
                    <span style={labelStyle}>Height:</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="number"
                        step="0.1"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        placeholder=""
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          borderRadius: radius,
                          border: `1px solid ${colors.lightGreen}`,
                          background: colors.white
                        }}
                      />
                      <span
                        style={{
                          alignSelf: 'center',
                          color: colors.grayText,
                          fontWeight: 600
                        }}
                      >
                        ft
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid' }}>
                    <span style={labelStyle}>Weight:</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="number"
                        step="0.1"
                        value={weightLbs}
                        onChange={(e) => setWeightLbs(e.target.value)}
                        placeholder=""
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          borderRadius: radius,
                          border: `1px solid ${colors.lightGreen}`,
                          background: colors.white
                        }}
                      />
                      <span
                        style={{
                          alignSelf: 'center',
                          color: colors.grayText,
                          fontWeight: 600
                        }}
                      >
                        lbs
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'grid' }}>
                    <span style={labelStyle}>Height:</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="number"
                        step="0.1"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        placeholder=""
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          borderRadius: radius,
                          border: `1px solid ${colors.lightGreen}`,
                          background: colors.white
                        }}
                      />
                      <span
                        style={{
                          alignSelf: 'center',
                          color: colors.grayText,
                          fontWeight: 600
                        }}
                      >
                        cm
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid' }}>
                    <span style={labelStyle}>Weight:</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="number"
                        step="0.1"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        placeholder=""
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          borderRadius: radius,
                          border: `1px solid ${colors.lightGreen}`,
                          background: colors.white
                        }}
                      />
                      <span
                        style={{
                          alignSelf: 'center',
                          color: colors.grayText,
                          fontWeight: 600
                        }}
                      >
                        kg
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                type="button"
                onClick={clearForm}
                style={{
                  flex: 1,
                  background: '#4B5A54',
                  color: colors.white,
                  padding: '12px',
                  borderRadius: radius,
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={calculate}
                style={{
                  flex: 1,
                  background: colors.mediumGreen,
                  color: colors.white,
                  padding: '12px',
                  borderRadius: radius,
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Calculate
              </button>
            </div>
          </div>

          <div
            style={{
              background: colors.lighterGreen,
              padding: 16,
              borderRadius: radius,
              border: `1px solid ${colors.lightGreen}`,
              display: 'grid',
              gap: 8,
              alignContent: 'start'
            }}
          >
            <div
              style={{
                borderBottom: `1px solid ${colors.lightGreen}`,
                paddingBottom: 8,
                fontWeight: 700,
                color: colors.darkGreen,
                textAlign: 'center'
              }}
            >
              RESULTS
            </div>
            <div
              style={{
                background: colors.white,
                borderRadius: radius,
                border: `1px solid ${colors.lightGreen}`,
                padding: 16,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 48, fontWeight: 800, color: colors.darkGreen }}>
                {result ? result.bmi : '--'}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontWeight: 800,
                  color: colors.darkGreen
                }}
              >
                {result ? result.status.toUpperCase() : '—'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: colors.darkGreen, fontSize: 20, marginBottom: 12 }}>BMI Range</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            <RangeRow color={colors.rangeUnder} label="Underweight" range="18.4 and under" radius={radius} />
            <RangeRow color={colors.rangeNormal} label="Normal" range="18.5 - 24.9" radius={radius} />
            <RangeRow color={colors.rangeOver} label="Overweight" range="25 - 29.9" radius={radius} />
            <RangeRow color={colors.rangeObese} label="Obese" range="30 - 34.9" radius={radius} />
            <RangeRow color={colors.rangeExtreme} label="Extremely Obese" range="35 and above" radius={radius} dark />
          </div>
        </div>
      </div>

      <aside
        style={{
          background: colors.lightGreen,
          padding: 16,
          borderRadius: radius,
          height: 'fit-content'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ color: colors.darkGreen, fontSize: 22, fontWeight: 800, margin: 0 }}>
            USER BMI HISTORY
          </h3>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                background: colors.darkGreen,
                color: colors.white,
                border: 'none',
                borderRadius: radius,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          )}
        </div>
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '24px 16px', 
            color: colors.grayText,
            fontWeight: 600
          }}>
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '24px 16px', 
            color: colors.grayText,
            fontWeight: 600
          }}>
            No history yet. Calculate your BMI to start tracking!
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
            {history.map((h, i) => (
              <li
                key={i}
                style={{
                  background: colors.lighterGreen,
                  padding: '10px 12px',
                  borderRadius: radius,
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: colors.darkGreen,
                  fontWeight: 600
                }}
              >
                <span>{h.value.toFixed(1)} ({h.status})</span>
                <span style={{ color: colors.grayText }}>{formatTimeAgo(h.timestamp)}</span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

function RangeRow({ color, label, range, radius, dark = false }) {
  return (
    <div
      style={{
        background: color,
        color: dark ? '#FFFFFF' : '#2F6F55',
        padding: '14px 16px',
        borderRadius: radius,
        fontWeight: 800,
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <span>{label}</span>
      <span style={{ fontWeight: 600 }}>Range: {range}</span>
    </div>
  );
}