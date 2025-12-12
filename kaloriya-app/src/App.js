import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layout/dashboardlayout';
import Register from './page/register';
import Dashboard from './page/dashboard';
import BMICalculator from './page/bmicalculator';

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bmi" element={<BMICalculator />} />
      </Route>
    </Routes>
  );
}