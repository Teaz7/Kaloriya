import {Routes,Route} from 'react-router-dom';
import Register from './page/register';
import Settings from './page/settings';
export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}