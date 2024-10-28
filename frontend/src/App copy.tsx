import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CustomerList from './components/Customer/CustomerList';
import TaxList from './components/Tax/TaxList';
// import { MainLayout } from './layouts/MainLayout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/" element={<MainLayout />}></Route> */}
        <Route path="/Home/" element={<Home />} />
        <Route path="/cadastros/clientes" element={<CustomerList />} />
        <Route path="/taxes" element={<TaxList />} />
        {/* Adicione outras rotas aqui conforme necessário */}
      </Routes>
    </Router>
  );
};

export default App;