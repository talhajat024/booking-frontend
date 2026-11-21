import { Route,Routes } from 'react-router-dom';
import Login from './pages/Login';
import { getUser } from './api';

function Home() {
  const user = getUser();
  return <p className="p-4">Logged in as {user?.role ?? 'nobody'}</p>;
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
