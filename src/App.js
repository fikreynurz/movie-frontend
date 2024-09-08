import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Header from './components/Header/Header';
import SearchResults from './pages/SearchResults';
import GlobalWrapper from './components/GlobalWrapper/GlobalWrapper'; // Import GlobalWrapper
import Footer from './components/Footer/Footer';

function App() {
  return (
    <Router>
      <Header />  {/* Header tetap di atas */}
      <GlobalWrapper>  {/* Wrapper yang mengatur margin global */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Detail />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </GlobalWrapper>
      <Footer />  {/* Footer tetap di bawah */}
      {console.log("Routing to:", window.location.pathname)}
    </Router>
  );
}

export default App;
