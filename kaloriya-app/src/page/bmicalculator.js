import React, { useMemo, useState } from 'react';


export default function BMICalculator() {
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

  const [tab, setTab] = useState('standard'); // 'standard' | 'metric'
  const [gender, setGender] = useState('M');
  const [age, setAge] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightLbs, setWeightLbs] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [bmi, setBmi] = useState(null);

  const result = useMemo(() => {
    if (bmi == null) return null;
    let status = 'Normal';
    if (bmi < 18.5) status = 'Underweight';
    else if (bmi < 25) status = 'Normal';
    else if (bmi < 30) status = 'Overweight';
    else if (bmi < 35) status = 'Obese';
    else status = 'Extremely Obese';
    return { bmi: bmi.toFixed(1), status };
  }, [bmi]);

  const calculate = (e) => {
    e.preventDefault();
    if (tab === 'standard') {
      const ft = parseFloat(heightFt);
      const lbs = parseFloat(weightLbs);
      if (!ft || !lbs) return setBmi(null);
      const inches = ft * 12;
      const bmiVal = (lbs / (inches * inches)) * 703;
      setBmi(bmiVal);
    } else {
      const cm = parseFloat(heightCm);
      const kg = parseFloat(weightKg);
      if (!cm || !kg) return setBmi(null);
      const m = cm / 100;
      const bmiVal = kg / (m * m);
      setBmi(bmiVal);
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

  const labelStyle = { color: colors.grayText, fontWeight: 600, marginBottom: 6 };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 10}}>
      <div>
        <h1 style={{ color: colors.darkGreen, letterSpacing: 1, fontSize: 36, marginBottom: 12 }}>
          BMI CALCULATOR
        </h1>

        {/* Tabs */}
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

        {/* Form + Result card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 220px',
            gap: 16,
            alignItems: 'start'
          }}
        >
          <form
            onSubmit={calculate}
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
                type="submit"
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
          </form>

          {/* Result card */}
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

        {/* BMI Range */}
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

      {/* History panel */}
      <aside
        style={{
          background: colors.lightGreen,
          padding: 16,
          borderRadius: radius,
          height: 'fit-content'
        }}
      >
        <h3 style={{ color: colors.darkGreen, fontSize: 22, fontWeight: 800, marginBottom: 12 }}>
          USER BMI HISTORY
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          {dummyHistory.map((h, i) => (
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
              <span>{h.value} ({h.status})</span>
              <span style={{ color: colors.grayText }}>{h.when}</span>
            </li>
          ))}
        </ul>
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

const dummyHistory = [
  { value: 21.8, status: 'Normal', when: '1 day ago' },
  { value: 22.2, status: 'Normal', when: '2 days ago' },
  { value: 22, status: 'Normal', when: '3 days ago' },
  { value: 24.5, status: 'Normal', when: '5 days ago' },
  { value: 25, status: 'Overweight', when: '6 days ago' },
  { value: 27.5, status: 'Overweight', when: '1 week ago' },
  { value: 29, status: 'Overweight', when: '1 week ago' },
  { value: 29.5, status: 'Overweight', when: '1 week ago' },
  { value: 30, status: 'Overweight', when: '1 week ago' }
];