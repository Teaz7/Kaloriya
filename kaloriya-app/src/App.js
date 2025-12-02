import {Routes,Route} from 'react-router-dom';
import Register from './page/register';

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}