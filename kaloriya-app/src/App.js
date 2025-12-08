import {Routes,Route} from 'react-router-dom';
import Register from './page/register';
import Dashboard from './page/dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}