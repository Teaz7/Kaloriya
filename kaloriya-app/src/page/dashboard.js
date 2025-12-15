import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [bmiHistory, setBmiHistory] = useState([]);
  const [calorieHistory, setCalorieHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calorieLoading, setCalorieLoading] = useState(false);

  const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
  const USER_ID = userFromStorage.id || 1;
  
  console.log("User from localStorage:", userFromStorage);
  console.log("Using USER_ID:", USER_ID);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadBMIHistory();
    loadCalorieHistory();
  }, []);

  const loadCalorieHistory = async () => {
    setCalorieLoading(true);
    try {
      const API_URL = 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/meal-log/${USER_ID}`);
      
      if (!response.ok) throw new Error('Failed to load meal history');
      
      const data = await response.json();
      console.log("Meal logs:", data);
      
      // Group meals by date and calculate total calories
      const caloriesByDate = {};
      
      // Process each meal log
      for (const meal of data) {
        const date = meal.log_date;
        
        // Get meal items for this meal log
        const itemsResponse = await fetch(`${API_URL}/meal-item/${meal.meal_log_id}`);
        const items = await itemsResponse.json();
        console.log(`Items for meal ${meal.meal_log_id}:`, items);
        
        // Calculate total calories for this meal
        const mealCalories = items.reduce((sum, item) => {
          const calories = parseFloat(item.calories) || 0;
          const quantity = parseFloat(item.quantity) || 1;
          return sum + (calories * quantity);
        }, 0);
        
        console.log(`Meal ${meal.meal_log_id} calories:`, mealCalories);
        
        // Add to date total
        if (!caloriesByDate[date]) {
          caloriesByDate[date] = {
            total: 0,
            date: new Date(date)
          };
        }
        caloriesByDate[date].total += mealCalories;
      }
      
      console.log("Calories by date:", caloriesByDate);
      
      // Convert to array and sort by most recent
      const calorieArray = Object.values(caloriesByDate)
        .map(item => ({
          calories: Math.round(item.total),
          date: item.date,
          timestamp: item.date.getTime()
        }))
        .sort((a, b) => b.timestamp - a.timestamp);
      
      console.log("Final calorie array:", calorieArray);
      setCalorieHistory(calorieArray);
    } catch (err) {
      console.error('Error loading calorie history:', err);
      setCalorieHistory([]);
    } finally {
      setCalorieLoading(false);
    }
  };

  const loadBMIHistory = async () => {
    setLoading(true);
    try {
      const API_URL = 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/bmi/${USER_ID}`);
      
      if (!response.ok) throw new Error('Failed to load BMI history');
      
      const data = await response.json();
      
      const formattedHistory = data.map(item => ({
        value: parseFloat(item.bmi_value),
        status: getBMIStatus(item.bmi_value),
        timestamp: new Date(item.date_computed).getTime(),
        dateComputed: new Date(item.date_computed)
      }));
      
      formattedHistory.sort((a, b) => b.timestamp - a.timestamp);
      
      setBmiHistory(formattedHistory);
    } catch (err) {
      console.error('Error loading BMI history:', err);
      setBmiHistory([]);
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

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const daysShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const liveDayName = daysShort[currentDateTime.getDay()];
  const liveMonthName = months[currentDateTime.getMonth()];
  const liveDayNumber = currentDateTime.getDate();

  const weekRange = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(currentDateTime);
    d.setDate(currentDateTime.getDate() + i);
    weekRange.push({
      dName: daysShort[d.getDay()],
      date: String(d.getDate()).padStart(2, '0'),
      isToday: i === 0
    });
  }

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true
  });

  const formattedDate = `${liveDayName.toUpperCase()}, ${liveMonthName}. ${liveDayNumber}`;

  const Donut = ({ size = 80, stroke = 14, value = 0, max = 100, color = "#7ecf73", children }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(1, Math.max(0, value / max));
    const dash = circumference * pct;
    const center = size / 2;
    
    return (
      <svg width={size} height={size} style={{ display: "block" }}>
        <circle cx={center} cy={center} r={radius} stroke="#e8f5e9" strokeWidth={stroke} fill="transparent" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${center} ${center})`}
          fill="transparent"
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={size * 0.26} fontWeight="800" fill="#2d5f4f">
          {children}
        </text>
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#f0f0f0' }}>
      <main style={{ flex: 1, background: '#fff', display: 'flex', gap: 10, overflow: "hidden", padding: 20 }}>
        {/* Left Column - Date and Meals */}
        <div style={{ flex: '0 0 20%' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, color: '#2d5f4f', marginBottom: 14 }}>
              <div style={{ fontSize: 26, fontWeight: 800 }}>{formattedDate}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{formattedTime}</div>
            </div>
            <div style={{ height: 4, background: '#3d6b5a', width: '100%', marginBottom: 18, borderRadius: 2 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              {weekRange.map((item, i) => (
                <div key={i} style={{
                  width: 46,
                  padding: '8px 4px',
                  textAlign: 'center',
                  background: item.isToday ? '#3d6b5a' : 'transparent',
                  color: item.isToday ? '#fff' : '#3d6b5a',
                  border: item.isToday ? 'none' : '1.5px solid #d0d0d0',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: item.isToday ? 700 : 600,
                  cursor: 'pointer',
                  lineHeight: 1.3
                }}>
                  <div style={{ fontWeight: 700 }}>{item.dName}</div>
                  <div style={{ fontSize: 12, marginTop: 2 }}>{item.date}</div>
                </div>
              ))}
            </div>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#2d5f4f', marginBottom: 22, marginTop: 8 }}>Recommended Meals for the Day</h2>

          {/* Breakfast */}
          <div style={{ background: '#9cdbab', borderRadius: 12, padding: '22px 24px', marginBottom: 18, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'visible' }}>
            <div style={{ flex: 1, paddingRight: 80 }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: 0.5, lineHeight: 1 }}>BREAKFAST</div>
              <div style={{ fontSize: 13, color: '#fff', marginTop: 8, opacity: 0.95 }}>Breakfast Meal with Breakfast Sides, etc.</div>
              <div style={{ fontSize: 12, color: '#fff', marginTop: 6 }}>Estimated Calorie Intake:</div>
              <button style={{ background: '#5a9a74', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', marginTop: 12, fontSize: 13 }}>Add Meal</button>
            </div>
            <div style={{ width: 100, height: 100, border: '7px solid rgba(234,246,238,0.7)', borderRadius: '50%', position: 'absolute', right: 30, background: 'transparent' }} />
          </div>

          {/* Lunch */}
          <div style={{ background: '#5a9a74', borderRadius: 12, padding: '22px 24px', marginBottom: 18, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'visible' }}>
            <div style={{ flex: 1, paddingRight: 80 }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: 0.5, lineHeight: 1 }}>LUNCH</div>
              <div style={{ fontSize: 13, color: '#fff', marginTop: 8, opacity: 0.95 }}>Lunch Meal, Lunch Sides, Lunch Dessert</div>
              <div style={{ fontSize: 12, color: '#fff', marginTop: 6 }}>Estimated Calorie Intake:</div>
              <button style={{ background: '#37715b', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', marginTop: 12, fontSize: 13 }}>Add Meal</button>
            </div>
            <div style={{ width: 100, height: 100, border: '7px solid rgba(234,246,238,0.5)', borderRadius: '50%', position: 'absolute', right: 30, background: 'transparent' }} />
          </div>

          {/* Dinner */}
          <div style={{ background: '#37715b', borderRadius: 12, padding: '22px 24px', marginBottom: 18, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'visible' }}>
            <div style={{ flex: 1, paddingRight: 80 }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: 0.5, lineHeight: 1 }}>DINNER</div>
              <div style={{ fontSize: 13, color: '#fff', marginTop: 8, opacity: 0.95 }}>Dinner Meal 1 & 2, Dinner Sides, etc.</div>
              <div style={{ fontSize: 12, color: '#fff', marginTop: 6 }}>Estimated Calorie Intake:</div>
              <button style={{ background: '#2d5f4f', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', marginTop: 12, fontSize: 13 }}>Add Meal</button>
            </div>
            <div style={{ width: 100, height: 100, border: '7px solid rgba(234,246,238,0.35)', borderRadius: '50%', position: 'absolute', right: 30, background: 'transparent' }} />
          </div>

          <button style={{ background: '#2d5f4f', color: '#fff', border: 'none', padding: '12px 26px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', marginTop: 12, fontSize: 14 }}>Check Other Meals</button>
        </div>

        {/* Middle Column - Suggestions and Macros */}
        <div style={{ flex: '0 0 28%', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#4a5f57', marginBottom: 16 }}>Meal Suggestions</h3>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: '#5a5a5a', padding: '10px 16px', borderRadius: 12, marginBottom: 5, display: 'flex', gap: 12, border: '2px solid #6a6a6a' }}>
                <div style={{ width: 60, height: 60, background: '#fff', borderRadius: 8, border: '2px solid #e0e0e0', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#fff', lineHeight: 1.4 }}>This meal with that side meal, drinks, etc.</div>
                  <button style={{ background: '#fff', color: '#333', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>Add Meal</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ border: '2px solid #c5d4cc', borderRadius: 12, padding: 10, background: '#fff' }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#2d5f4f', marginBottom: 16 }}>Macronutrients Progress</h3>
            <div style={{ display: 'flex', gap: 18, marginBottom: 20, alignItems: 'center' }}>
              <div style={{ flexShrink: 0 }}>
                <Donut size={140} stroke={16} value={1450} max={2500} color="#a8e6a3">1450</Donut>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#2d5f4f', marginBottom: 12 }}>CALORIES</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Avg. Daily Intake:</span>
                  <strong style={{ color: '#2d5f4f' }}>2500</strong>
                </div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Avg. Weekly Intake:</span>
                  <strong style={{ color: '#2d5f4f' }}>13000</strong>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'space-around', paddingTop: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <Donut size={64} stroke={8} value={400} max={800} color="#a8e6a3">400</Donut>
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 8, color: '#2d5f4f' }}>FATS</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Donut size={64} stroke={8} value={600} max={800} color="#a8e6a3">600</Donut>
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 8, color: '#2d5f4f' }}>PROTEIN</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Donut size={64} stroke={8} value={1000} max={1600} color="#a8e6a3">1000</Donut>
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 8, color: '#2d5f4f' }}>CARBS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - History Panel */}
        <div style={{ flex: '0 0 22%' }}>
          <div style={{ background: '#e9fbe8', padding: 20, borderRadius: 10, height: '100%', border: '1px solid #d5edd4' }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#2d5f4f', marginBottom: 14 }}>
              Daily Calorie Intake History
              {calorieLoading && <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 8 }}>(Loading...)</span>}
            </h3>
            <div style={{ borderBottom: '1.5px dashed #b8d4b6', paddingBottom: 14, marginBottom: 14 }}>
              {calorieHistory.length > 0 ? (
                calorieHistory.map((h, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 14 }}>
                    <div style={{ fontWeight: 700, color: '#2d5f4f' }}>{h.calories}kCal</div>
                    <div style={{ color: '#5a9a74', fontSize: 13 }}>{getTimeAgo(h.date)}</div>
                  </div>
                ))
              ) : !calorieLoading && (
                <div style={{ color: '#666', fontSize: 13, fontStyle: 'italic' }}>No calorie history available</div>
              )}
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#2d5f4f', marginBottom: 12, marginTop: 16 }}>
              Body Mass Index History
              {loading && <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 8 }}>(Loading...)</span>}
            </h3>
            <div>
              {bmiHistory.length > 0 ? (
                bmiHistory.map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 14 }}>
                    <div style={{ color: '#2d5f4f' }}>
                      {b.value.toFixed(1)} ({b.status})
                    </div>
                    <div style={{ color: '#5a9a74', fontSize: 13 }}>{getTimeAgo(b.dateComputed)}</div>
                  </div>
                ))
              ) : !loading && (
                <div style={{ color: '#666', fontSize: 13, fontStyle: 'italic' }}>No BMI history available</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;