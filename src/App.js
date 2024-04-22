import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EmpListing from './view/EmpListing';
import EmpCreate from './view/EmpCreate';
import EmpDetail from './view/EmpDetail';
import EmpEditModal from './component/modalEdit'; 
import EmpDetailModal from './component/modalDetail';
import EmpCreateModal from './component/modalCreate';
import LuongList from './view/luongListing';
import Header from './component/header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Container from 'react-bootstrap/Container';
import { Row } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Container>
        <Row>
      <Header />
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/home' element={<EmpListing />} />
          <Route path='/employee/create' element={<EmpCreateModal />} />
          <Route path='/employee/detail/:idnv' element={<EmpDetailModal />} />
          <Route path='/employee/edit/:idnv' element={<EmpEditModal />} />
          <Route path='/luong' element={<LuongList />} />
        </Routes>
      </BrowserRouter>
      </Row>
      </Container>
    </div>
  );
}

export default App;
