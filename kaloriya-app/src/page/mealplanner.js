import React, { useState, useEffect } from "react";
import mealData from '../component/mealinformation.js';

export default function MealPlanner() {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mealHistory, setMealHistory] = useState([]);
  const [userId] = useState(1);
  const [mealSlots, setMealSlots] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const days = [
    { name: 'SUNDAY', date: '2025-11-23', rowIndex: 0 },
    { name: 'MONDAY', date: '2025-11-24', rowIndex: 1 },
    { name: 'TUESDAY', date: '2025-11-25', rowIndex: 2 },
    { name: 'WEDNESDAY', date: '2025-11-26', rowIndex: 3 }
  ];

  const meals = ['BREAKFAST', 'LUNCH', 'DINNER'];

  useEffect(() => {
    loadMealHistory();
    initializeMealSlots();
  }, []);

  const initializeMealSlots = () => {
    const slots = {};
    days.forEach(day => {
      meals.forEach(meal => {
        const key = `${day.date}_${meal}`;
        slots[key] = 0;
      });
    });
    setMealSlots(slots);
  };

  const loadMealHistory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/meal-log/${userId}`);
      const data = await res.json();
      setMealHistory(data.slice(0, 8));
    } catch (err) {
      console.error("Error loading meal history:", err);
    }
  };

  const handleSearchNutrition = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a food item to search");
      return;
    }

    setSearchLoading(true);
    try {
      // Fetch nutrition data from API
      const res = await fetch("http://localhost:5000/api/nutrition/ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredient: searchQuery }),
      });

      const data = await res.json();
      console.log("Nutrition data:", data);

      // Extract nutrition info from API response
      const nutritionInfo = data.data || data;
      
      // Add directly to database
      const foodData = {
        food_name: searchQuery,
        serving_size: nutritionInfo.serving_size || "1 serving",
        calories: parseFloat(nutritionInfo.calories || 0),
        protein: parseFloat(nutritionInfo.protein || 0),
        carbohydrates: parseFloat(nutritionInfo.carbohydrates || 0),
        fats: parseFloat(nutritionInfo.fats || 0),
        quantity: 1
      };

      // Add to database with current date and BREAKFAST as default
      const addMealRes = await fetch("http://localhost:5000/api/add-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          log_date: new Date().toISOString().split('T')[0],
          meal_type: "BREAKFAST",
          foods: [foodData]
        }),
      });

      const result = await addMealRes.json();
      
      if (addMealRes.ok) {
        // Clear search and reload history
        setSearchQuery("");
        await loadMealHistory();
        alert(`${searchQuery} added successfully!`);
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Error fetching nutrition:", err);
      alert("Failed to add meal");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddMeal = async (dayDate, mealType, rowIndex) => {
    const mealTypeKey = mealType.toLowerCase();
    const mealsForType = mealData[mealTypeKey] || [];
    
    if (mealsForType.length === 0) {
      alert(`No meals available for ${mealType}`);
      return;
    }

    // Use rowIndex to get the correct meal for this row
    const mealIndex = rowIndex % mealsForType.length;
    const meal = mealsForType[mealIndex];

    setLoading(true);
    
    try {
      const foodData = {
        food_name: meal.food_name,
        serving_size: meal.serving_size,
        calories: parseFloat(meal.calories),
        protein: parseFloat(meal.protein),
        carbohydrates: parseFloat(meal.carbohydrates),
        fats: parseFloat(meal.fats),
        quantity: 1
      };

      const addMealRes = await fetch("http://localhost:5000/api/add-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          log_date: dayDate,
          meal_type: mealType,
          foods: [foodData]
        }),
      });

      const result = await addMealRes.json();
      
      if (addMealRes.ok) {
        await loadMealHistory();
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add meal");
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Just now";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "1d ago";
    return `${diffDays}d ago`;
  };

  const getMealForSlot = (dayDate, mealType, rowIndex) => {
    const mealTypeKey = mealType.toLowerCase();
    const mealsForType = mealData[mealTypeKey] || [];
    
    if (mealsForType.length === 0) return null;
    
    // Use rowIndex to determine which meal to show (0-3)
    const mealIndex = rowIndex % mealsForType.length;
    return mealsForType[mealIndex];
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      gap: '20px',
    },
    plannerSection: {
      flex: 1,
      position: 'relative'
    },
    header: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#37715B',
      marginBottom: '5px'
    },
    headerUnderline: {
      height: '3px',
      backgroundColor: '#37715B',
      width: '100%',
      maxWidth: '720px',
      marginBottom: '20px'
    },
    controls: {
      display: 'flex',
      gap: '15px',
      marginBottom: '30px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    searchLabel: {
      fontSize: '17px',
      fontWeight: 'bold',
      color: '#333'
    },
    searchInput: {
      padding: '8px 15px',
      border: '2px solid #ccc',
      borderRadius: '10px',
      width: '300px',
      color: '#37715B',
      fontSize: '14px'
    },
    searchButton: {
      padding: '10px 25px',
      backgroundColor: '#1C513D',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      minWidth: '120px',
      transition: 'opacity 0.2s'
    },
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr repeat(3, 1fr)',
      gap: '10px',
      marginBottom: '10px'
    },
    headerCell: {
      backgroundColor: '#4a4a4a',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: 'bold'
    },
    tableBody: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    dayRow: {
      display: 'grid',
      gridTemplateColumns: '1fr repeat(3, 1fr)',
      gap: '10px'
    },
    dayCell: {
      backgroundColor: '#4a4a4a',
      color: 'white',
      padding: '20px 15px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    dayName: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '4px',
      textAlign: 'center'
    },
    dayDate: {
      fontSize: '11px',
      opacity: 0.8,
      textAlign: 'center',
      color: '#D8FCCB'
    },
    mealCell: {
      padding: '20px',
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      minHeight: '120px',
      position: 'relative'
    },
    mealInfo: {
      textAlign: 'center',
      marginBottom: 'auto',
      paddingTop: '10px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start'
    },
    mealName: {
      fontSize: '13px',
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    mealDetails: {
      fontSize: '10px'
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#1C513D',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '13px',
      transition: 'opacity 0.2s'
    },
    historySection: {
      width: '280px',
      backgroundColor: '#D8FCCB',
      borderRadius: '40px',
      padding: '30px',
      maxHeight: '700px',
      overflowY: 'auto',
      alignSelf: 'flex-start'
    },
    historyHeader: {
      fontSize: '26px',
      fontWeight: 'bold',
      color: '#37715B',
      marginBottom: '10px'
    },
    historyUnderline: {
      height: '2px',
      backgroundColor: '#37715B',
      marginBottom: '20px'
    },
    historyItem: {
      marginBottom: '15px',
      fontSize: '13px',
      color: '#2d5f4f',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: '8px'
    },
    historyMealName: {
      fontWeight: '500',
      flex: 1
    },
    historyTime: {
      fontStyle: 'italic',
      fontSize: '11px',
      color: '#2d5f4f',
      whiteSpace: 'nowrap',
      marginLeft: '10px'
    }
  };

  const getMealColor = (mealIndex) => {
    const colors = ['#9CDBAB', '#5A9A74', '#37715B'];
    return colors[mealIndex];
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.plannerSection}>
          <h1 style={styles.header}>MEAL PLANNER</h1>
          <div style={styles.headerUnderline}></div>

          <div style={styles.controls}>
            <span style={styles.searchLabel}>Search Meal:</span>
            <input 
              type="text" 
              style={styles.searchInput}
              placeholder="e.g., chicken breast, apple, rice"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchNutrition()}
            />
            <button 
              style={{
                ...styles.searchButton,
                opacity: searchLoading ? 0.6 : 1,
                cursor: searchLoading ? 'not-allowed' : 'pointer'
              }}
              onClick={handleSearchNutrition}
              disabled={searchLoading}
            >
              {searchLoading ? "Adding..." : "SEARCH"}
            </button>
          </div>

          <div style={styles.tableHeader}>
            <div style={styles.headerCell}>WEEK</div>
            {meals.map((meal, idx) => (
              <div key={idx} style={styles.headerCell}>{meal}</div>
            ))}
          </div>

          <div style={styles.tableBody}>
            {days.map((day, dayIdx) => (
              <div key={dayIdx} style={styles.dayRow}>
                <div style={styles.dayCell}>
                  <div style={styles.dayName}>{day.name}</div>
                  <div style={styles.dayDate}>{day.date}</div>
                </div>
                {meals.map((meal, mealIdx) => {
                  const nextMeal = getMealForSlot(day.date, meal, day.rowIndex);
                  const isBreakfast = mealIdx === 0;
                  const textColor = isBreakfast ? '#1C513D' : 'white';
                  
                  return (
                    <div 
                      key={mealIdx} 
                      style={{
                        ...styles.mealCell,
                        backgroundColor: getMealColor(mealIdx)
                      }}
                    >
                      {nextMeal && (
                        <div style={styles.mealInfo}>
                          <div style={{...styles.mealName, color: textColor}}>
                            {nextMeal.food_name}
                          </div>
                          <div style={{...styles.mealDetails, color: textColor}}>
                            {nextMeal.serving_size} • {nextMeal.calories} cal
                          </div>
                        </div>
                      )}
                      
                      <button 
                        style={{
                          ...styles.addButton,
                          opacity: loading ? 0.6 : 1,
                          cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => handleAddMeal(day.date, meal, day.rowIndex)}
                        disabled={loading}
                      >
                        {loading ? "Adding..." : "Add Meal"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.historySection}>
          <div style={styles.historyHeader}>MEAL HISTORY</div>
          <div style={styles.historyUnderline}></div>
          
          {mealHistory.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#2d5f4f', fontSize: '12px', fontStyle: 'italic' }}>
              No meals logged yet
            </div>
          ) : (
            mealHistory.map((item, idx) => (
              <div key={idx} style={styles.historyItem}>
                <span style={styles.historyMealName}>
                  {item.foods || 'Meal'}
                </span>
                <span style={styles.historyTime}>
                  {formatTimeAgo(item.created_at)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}