import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';  // Import SearchResults
import Detail from './pages/Detail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<Detail />} />
        <Route path="/search" element={<SearchResults />} /> {/* Tambahkan Route Search */}
      </Routes>
      {console.log("Routing to:", window.location.pathname)} 
    </Router>
  );
}

export default App;
