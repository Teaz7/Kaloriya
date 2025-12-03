import {Routes,Route} from 'react-router-dom';
import Register from './page/register';
import ApiTest from './page/apitest';
import Login from './page/login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/apitest" element={<ApiTest />} />
    </Routes>
  )
}