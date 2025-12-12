import React, { useState } from "react";

export default function MealPlanner() {
  const days = [
    { name: 'SUNDAY', date: 'NOV. 23, 2025' },
    { name: 'MONDAY', date: 'NOV. 24, 2025' },
    { name: 'TUESDAY', date: 'NOV. 25, 2025' },
    { name: 'WEDNESDAY', date: 'NOV. 26, 2025' }
  ];

  const meals = ['BREAKFAST', 'LUNCH', 'DINNER'];
  
  const mealHistory = [
    { label: 'Meal', time: '2 hours ago' },
    { label: 'Meal', time: '10 hours ago' },
    { label: 'Meal', time: '19 hours ago' },
    { label: 'Meal', time: '1 day ago' },
    { label: 'Meal', time: '1 day ago' },
    { label: 'Meal', time: '1 day ago' },
    { label: 'Meal', time: '2 day ago' },
    { label: 'Meal', time: '2 day ago' }
  ];

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      gap: '10px',

    },
    plannerSection: {
      flex: 1
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
      width: '720px',
      marginBottom: '20px'
    },
    controls: {
      display: 'flex',
      gap: '20px',
      marginBottom: '30px',
      alignItems: 'center'
    },
    searchLabel: {
      fontSize: '17px',
      fontWeight: 'bold',
      color: '#333'
    },
    searchInput: {
      padding: '5px 55px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      width: '250px',
      color: '#37715B'
    },
    sortLabel: {
      fontSize: '17px',
      fontWeight: 'bold',
      color: '#333',
      marginLeft: '20px'
    },
    sortSelect: {
      padding: '5px 54px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      color: '#37715B'
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
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingBottom: '15px',
      minHeight: '100px'
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#1C513D',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '13px'
    },
    historySection: {
      width: '200px',
      backgroundColor: '#D8FCCB',
      borderRadius: '40px',
      padding: '40px',
      paddingTop: '85px',
      marginTop: '37px'
    },
    historyHeader: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#37715B',
      marginBottom: '10px'
    },
    historyUnderline: {
      height: '2px',
      padding: '1px',
      backgroundColor: '#37715B',
      marginBottom: '25px'
    },
    historyItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '15px',
      fontSize: '14px',
      color: '#2d5f4f'
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
            <input type="text" style={styles.searchInput} />
            <span style={styles.sortLabel}>Sort:</span>
            <select style={styles.sortSelect}>
              <option>-</option>
            </select>
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
                {meals.map((meal, mealIdx) => (
                  <div 
                    key={mealIdx} 
                    style={{
                      ...styles.mealCell,
                      backgroundColor: getMealColor(mealIdx)
                    }}
                  >
                    <button style={styles.addButton}>Add Meal</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.historySection}>
          <div style={styles.historyHeader}>MEAL HISTORY</div>
          <div style={styles.historyUnderline}></div>
          
          {mealHistory.map((item, idx) => (
            <div key={idx} style={styles.historyItem}>
              <span>{item.label}</span>
              <span style={{ fontStyle: 'italic', fontSize: '12px' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}