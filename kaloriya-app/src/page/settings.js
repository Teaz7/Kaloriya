import DashboardLayout from "../layout/dashboardlayout";
import React, { useState, useEffect } from 'react';


// --- DUMMY DATA ---
const userData = {
  name: 'VONN ADRIAN TILANO',
  email: 'vonnadriantilano@gmail.com', 
  birthdate: '01/01/2005',
  contactNo: '+69691234567',
  height: '7ft 10in',
  weight: '150 lbs',
  profileImage: 'vonn-ivan.jpg', 
  nutrition: [
    { label: 'Calories', value: 85, color: '#4B8869' }, 
    { label: 'Protein', value: 70, color: '#5AA375' }, 
    { label: 'Carbs', value: 95, color: '#6BBF85' }, 
    { label: 'Fats', value: 50, color: '#9DD4B4' }, 
  ],
};

// --- COLOR PALETTE (Based on Image) ---
const COLORS = {
  DeepGreen: '#38765A', 
  MediumGreen: '#4B8869',
  White: '#FFFFFF',
  GrayText: '#333333',
  LightGray: '#F7F7F7',
};

// --- COMPONENT DEFINITIONS (Unchanged for brevity) ---

// 1. Sidebar Component
const Sidebar = ({ activeItem, onNavigate }) => {
  const navItems = ['Dashboard', 'Meal Planner', 'BMI Calculator', 'Settings'];
  
  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarTop}>
          <h1 style={styles.logo}>KALORIYA</h1>
          <div style={styles.logoUnderline}></div>
          
          <nav>
            {navItems.map(item => (
              <div
                key={item}
                style={{ 
                  ...styles.sidebarItem, 
                  ...(item === activeItem ? styles.sidebarItemActive : {})
                }}
                onClick={() => onNavigate(item)}
              >
                {item}
              </div>
            ))}
          </nav>
      </div>
      
      <button style={styles.logOutButton}>LOG OUT</button>
    </div>
  );
};

// 2. Settings Menu Component
const SettingsMenu = ({ activeSetting, onSelect }) => {
  const menuItems = ['Account', 'Preferences', 'Terms & Services', 'Help'];
  
  return (
    <div style={styles.settingsMenu}>
        {menuItems.map(item => (
          <div
            key={item}
            style={{ 
              ...styles.menuItem, 
              ...(item === activeSetting ? styles.menuItemActive : {}) 
            }}
            onClick={() => onSelect(item)}
          >
            {item}
          </div>
        ))}
    </div>
  );
};

// 3. Nutrition Progress Component
const NutritionProgress = ({ data }) => {
  const maxVal = 100;

  return (
    <div style={styles.nutritionProgressContainer}>
      <h3 style={styles.progressHeader}>NUTRITION PROGRESS</h3>
      <div style={styles.barChart}>
        {data.map(item => (
          <div key={item.label} style={styles.barWrapper}>
            <div
              style={{
                ...styles.bar,
                // Scale bar height based on the chart height (150px)
                height: `${(item.value / maxVal) * 150}px`, 
                backgroundColor: item.color,
              }}
            ></div>
          </div>
        ))}
      </div>
      <div style={styles.barLabelsRow}>
          {data.map(item => (
            <div key={item.label} style={styles.barLabel}>{item.label}</div>
          ))}
      </div>
    </div>
  );
};

// 4. Main Settings Page Component
function SettingsPageAccurate() {
  const [activeSidebar, setActiveSidebar] = useState('Settings');
  const [activeSetting, setActiveSetting] = useState('Account');

  return (
    <div style={styles.settingsLayout}>
      
      {/* Sidebar Component */}
      <Sidebar activeItem={activeSidebar} onNavigate={setActiveSidebar} />

      <div style={styles.settingsMainArea}>
        
        {/* Header Structure */}
        <div style={styles.mainHeaderContainer}>
            <h1 style={styles.mainHeader}>SETTINGS</h1>
            <div style={styles.mainHeaderUnderline}></div> 
        </div>
        
        {/* The settings content grid needs to ensure the menu extends to the bottom of the page content */}
        <div style={styles.settingsContentGrid}>
          
          {/* Settings Menu (Left Column) */}
          <SettingsMenu activeSetting={activeSetting} onSelect={setActiveSetting} />

          {/* Main Account Content (Right Column) */}
          <div style={styles.settingDetails}>
            
            {activeSetting === 'Account' && (
              <>
                <h2 style={styles.sectionTitle}>ACCOUNT</h2>
                
                {/* Profile Header and Nutrition Chart */}
                <div style={styles.profileHeader}>
                  <img 
                    src={userData.profileImage} 
                    alt="User Profile" 
                    style={styles.profileImage} 
                  />
                  <div style={styles.profileInfo}>
                    <h2 style={styles.userName}>{userData.name}</h2>
                    <button style={styles.editProfileButton}>Edit User Profile</button>
                  </div>
                  
                  {/* Nutrition Progress - Positioned in the corner */}
                  <div style={styles.nutritionChartArea}>
                     <NutritionProgress data={userData.nutrition} />
                  </div>
                </div>

                {/* Account Details Grid */}
                <div style={styles.accountDetailsRow}>
                    
                    {/* Detail Column (NEW STACKING LAYOUT) */}
                    <div style={styles.detailColumn}>
                        
                        {/* 1. Email Address (Full Width) */}
                        <div style={{ ...styles.detailItemRepaired, width: '100%' }}>
                            <span style={styles.detailLabelRepaired}>Email Address:</span>
                            <span style={styles.detailValueRepaired}>{userData.email}</span>
                        </div>

                        {/* 2. Birthdate and Height (Two Columns) */}
                        <div style={styles.twoColumnGroup}>
                            <div style={styles.detailItemRepaired}>
                                <span style={styles.detailLabelRepaired}>Birthdate:</span>
                                <span style={styles.detailValueRepaired}>{userData.birthdate}</span>
                            </div>
                            <div style={styles.detailItemRepaired}>
                                <span style={styles.detailLabelRepaired}>Height:</span>
                                <span style={styles.detailValueRepaired}>{userData.height}</span>
                            </div>
                        </div>

                        {/* 3. Contact No. and Weight (Two Columns) */}
                        <div style={styles.twoColumnGroup}>
                            <div style={styles.detailItemRepaired}>
                                <span style={styles.detailLabelRepaired}>Contact No.:</span>
                                <span style={styles.detailValueRepaired}>{userData.contactNo}</span>
                            </div>
                            <div style={styles.detailItemRepaired}>
                                <span style={styles.detailLabelRepaired}>Weight:</span>
                                <span style={styles.detailValueRepaired}>{userData.weight}</span>
                            </div>
                        </div>
                        
                        {/* 4. Password (Full Width) */}
                         <div style={{ ...styles.detailItemRepaired, width: '100%', marginTop: '10px' }}>
                            <span style={styles.detailLabelRepaired}>Password & Authentication:</span>
                            <button style={styles.changePassButton}>Change Password</button>
                        </div>
                    </div>
                    
                </div>
                
                {/* Divider Line and Preferences Heading */}
                <div style={styles.preferencesDivider}></div>
                <h2 style={styles.sectionTitlePreferences}>PREFERENCES</h2>
              </>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}

// --- INLINE STYLES FOR ACCURACY ---

const styles = {
  // --- GLOBAL LAYOUT ---
  settingsLayout: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif', 
    backgroundColor: COLORS.White,
  },
  settingsMainArea: {
    flexGrow: 1,
    padding: '2rem 3rem',
    display: 'flex',
    flexDirection: 'column',
  },
  
  // --- HEADER STYLES (Unchanged) ---
  mainHeaderContainer: {
    marginBottom: '3rem', 
    width: 'fit-content', 
    flexShrink: 0, 
    marginTop: '-0.5rem', 
  },
  mainHeader: {
    fontSize: '2rem',
    fontWeight: '900',
    color: COLORS.DeepGreen,
    margin: 0,
    padding: 0,
    lineHeight: 1.2,
  },
  mainHeaderUnderline: {
    height: '3px',
    backgroundColor: COLORS.DeepGreen,
    width: '100%',
    marginTop: '5px',
  },
  
  // --- CONTENT GRID MODIFICATION (Unchanged) ---
  settingsContentGrid: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr', 
    gap: '5rem',
    flexGrow: 1, 
  },
  
  // --- SIDEBAR STYLES (Unchanged) ---
  sidebar: {
    width: '250px',
    backgroundColor: COLORS.DeepGreen, 
    color: COLORS.White,
    padding: '2rem 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRight: '1px solid #101010', 
  },
  sidebarTop: {
      paddingBottom: '30px',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'normal',
    letterSpacing: '2px',
    margin: '0 25px 0.5rem',
  },
  logoUnderline: {
    height: '3px',
    width: '180px', 
    backgroundColor: COLORS.White,
    margin: '0 25px 30px',
  },
  sidebarItem: {
    padding: '12px 25px',
    cursor: 'pointer',
    fontWeight: 500,
  },
  sidebarItemActive: {
    backgroundColor: COLORS.White,
    color: COLORS.DeepGreen,
    borderLeft: `5px solid ${COLORS.White}`, 
    paddingLeft: '20px',
  },
  logOutButton: {
    padding: '10px 30px',
    margin: '0 25px 30px 25px',
    backgroundColor: COLORS.White,
    border: 'none',
    color: COLORS.DeepGreen,
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  
  // --- SETTINGS MENU STYLES (Unchanged) ---
  settingsMenu: {
    paddingTop: '0.5rem',
    borderTop: `2px solid ${COLORS.DeepGreen}`,    
    borderRight: `2px solid ${COLORS.DeepGreen}`, 
    borderLeft: `2px solid ${COLORS.DeepGreen}`,  
    borderBottom: 'none',                        
    borderRadius: '5px 5px 0 0',                 
    alignSelf: 'stretch', 
    height: '100%', 
  },
  menuItem: {
    padding: '10px 15px',
    margin: '5px 0',
    cursor: 'pointer',
    color: COLORS.GrayText,
    borderRadius: '5px',
  },
  menuItemActive: {
    backgroundColor: COLORS.DeepGreen,
    color: COLORS.White,
    fontWeight: 'bold',
  },
  
  // --- ACCOUNT/DETAIL STYLES (MODIFIED) ---
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: COLORS.DeepGreen,
    paddingBottom: '5px',
    width: 'fit-content',
    marginBottom: '0.5rem', 
  },
  sectionTitlePreferences: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: COLORS.DeepGreen,
    paddingBottom: '5px',
    width: 'fit-content',
    marginTop: '1.5rem', 
  },
  profileHeader: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr 320px', 
    alignItems: 'start',
    marginBottom: '0', 
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '5px',
    border: `2px solid ${COLORS.DeepGreen}`,
    objectFit: 'cover',
  },
  profileInfo: {
    lineHeight: '1.2',
    paddingTop: '10px',
  },
  userName: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: COLORS.DeepGreen,
    margin: 0,
    padding: 0,
    letterSpacing: '-1px',
    lineHeight: '1',
  },
  editProfileButton: {
    backgroundColor: '#E0E0E0',
    border: 'none',
    padding: '5px 15px',
    borderRadius: '20px',
    cursor: 'pointer',
    marginTop: '5px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  accountDetailsRow: {
    display: 'flex',
    justifyContent: 'flex-start', 
    width: '100%',
    gap: '30px', 
    marginTop: '-13.0rem', // ***MODIFIED: -12.0rem***
  },
  detailColumn: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0, 
    width: '500px', 
  },
  twoColumnGroup: {
    display: 'flex',
    gap: '40px', 
    width: '100%',
    marginBottom: '10px',
  },
  detailItemRepaired: {
    display: 'flex',
    flexDirection: 'column', 
    marginBottom: '0', 
    fontSize: '0.95rem',
    lineHeight: '1.5',
    flexBasis: '50%', 
  },
  detailLabelRepaired: {
    fontWeight: 'bold',
    color: COLORS.DeepGreen, 
    minWidth: 'auto', 
    marginRight: '0', 
    paddingBottom: '2px', 
  },
  detailValueRepaired: {
    color: COLORS.GrayText,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    fontSize: '1.2rem', 
  },
  changePassButton: {
    backgroundColor: '#616161', 
    border: 'none',
    color: COLORS.White,
    padding: '5px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  preferencesDivider: {
    borderTop: `2px solid ${COLORS.DeepGreen}`, // MODIFIED: Changed from #D0D0D0 to COLORS.DeepGreen
    marginTop: '2rem', 
    marginBottom: '0.5rem', 
  },

  // --- NUTRITION PROGRESS STYLES (Unchanged) ---
  nutritionChartArea: {
    paddingTop: '35px', 
    width: '100%', 
  },
  nutritionProgressContainer: {
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%', 
    marginTop: '100px', 
  },
  progressHeader: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: COLORS.White,
    backgroundColor: COLORS.DeepGreen,
    textAlign: 'center',
    padding: '5px 0',
    margin: 0,
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
  },
  barChart: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '150px', 
    padding: '10px 5px 0',
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '20%',
  },
  bar: {
    width: '80%',
    borderRadius: '5px 5px 0 0',
    transition: 'height 0.3s ease-in-out',
  },
  barLabelsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '5px 5px 10px',
  },
  barLabel: {
    fontSize: '0.7rem',
    color: COLORS.GrayText,
    textAlign: 'center',
    width: '20%',
  },
};

export default SettingsPageAccurate;