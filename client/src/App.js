import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


function App() {
  return (
    <main>
      {/* The use of outlet is to render child routes, which are defined in the router configuration. */}
      <Outlet/>
      <Toaster/>
    </main>
  );
}

export default App;
