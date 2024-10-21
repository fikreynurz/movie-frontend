import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from './theme';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Header from './components/Header/Header';
import SearchResults from './pages/SearchResults';
import GlobalWrapper from './components/GlobalWrapper/GlobalWrapper';
import Footer from './components/Footer/Footer';
import FilterResults from './pages/FilterResults';
import Profile from './pages/Profile';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import GenreList from './components/AdminPage/Genre/GenreList';
import ReviewList from './components/AdminPage/Review/ReviewList';
import MovieList from './components/AdminPage/Movie/MovieList';
import RecentMovie from './pages/CatRecentMovie';
import PopularMovie from './pages/CatPopularMovie';
import AdminRoute from './components/AdminRoute'; // Pastikan import AdminRoute
import UserTable from './components/AdminPage/UserTable'

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Router>
      <Header /> 
      <GlobalWrapper style={{ flexGrow: 1 }}> 
        <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Detail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/filter-results" element={<FilterResults />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cat/recent-movies" element={<RecentMovie />} />
          <Route path="/cat/popular-movies" element={<PopularMovie />} />

          {/* Parent Route Admin yang Dilindungi */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="genre" element={<GenreList />} />
            <Route path="review" element={<ReviewList />} />
            <Route path="movie" element={<MovieList />} />
            <Route path="user" element={<UserTable />} />
          </Route>
        </Routes>
        </div>
      </GlobalWrapper>
      <Footer />
      {console.log("Routing to:", window.location.pathname)}
    </Router>
    </div>
    </ThemeProvider>
  );
}

export default App;
