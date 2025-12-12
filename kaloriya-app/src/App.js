import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layout/dashboardlayout';
import Register from './page/register';
import Dashboard from './page/dashboard';
import BMICalculator from './page/bmicalculator';
import ApiTest from './page/apitest';
import Login from './page/login';
import MealPlanner from './page/mealplanner';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bmi" element={<BMICalculator />} />
      </Route>
      <Route path="/apitest" element={<ApiTest />} />
      <Route path="/mealplanner" element={<MealPlanner/>} />
    </Routes>
  );
}