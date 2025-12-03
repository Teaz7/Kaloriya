import {Routes,Route} from 'react-router-dom';
import Register from './page/register';
import ApiTest from './page/apitest';

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/apitest" element={<ApiTest />} />
    </Routes>
  )
}