import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EmpListing from './EmpListing';
import EmpCreate from './EmpCreate';
import EmpDetail from './EmpDetail';
import EmpEdit from './EmpEdit';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <h1>React js CRUD</h1>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<EmpListing />}></Route>
          <Route path='/employee/create' element={<EmpCreate />}></Route>
          <Route path='/employee/detail/:idnv' element={<EmpDetail />}></Route>
          <Route path='/employee/edit/:idnv' element={<EmpEdit />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );

}

export default App;
