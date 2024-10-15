// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import UserListAdmin from './components/AdminPage/User/UserList';
import UserAddAdmin from './components/AdminPage/User/AddUser';
import UserEditAdmin from './components/AdminPage/User/EditUser';
import GenreList from './components/AdminPage/Genre/GenreList';
import ReviewList from './components/AdminPage/Review/ReviewList';
import MovieList from './components/AdminPage/Movie/MovieList';
import RecentMovie from './pages/CatRecentMovie';
import PopularMovie from './pages/CatPopularMovie';
import AdminRoute from './components/AdminRoute'; // Pastikan import AdminRoute

function App() {
  return (
    <Router>
      <Header /> 
      <GlobalWrapper> 
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
            <Route path="userlist" element={<UserListAdmin />} />
            <Route path="useradd" element={<UserAddAdmin />} />
            <Route path="useredit/:_id" element={<UserEditAdmin />} />
            <Route path="genre" element={<GenreList />} />
            <Route path="review" element={<ReviewList />} />
            <Route path="movie" element={<MovieList />} />
          </Route>
        </Routes>
      </GlobalWrapper>
      <Footer />
      {console.log("Routing to:", window.location.pathname)}
    </Router>
  );
}

export default App;
