import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Header from './components/Header/Header';
import SearchResults from './pages/SearchResults';
import GlobalWrapper from './components/GlobalWrapper/GlobalWrapper'; // Import GlobalWrapper
import Footer from './components/Footer/Footer';
import FilterResults from './pages/FilterResults';
import Profile from './pages/Profile';
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import UserListAdmin from './components/AdminPage/User/UserList'
import UserAddAdmin from './components/AdminPage/User/AddUser'
import UserEditAdmin from './components/AdminPage/User/EditUser'


function App() {
  return (
    <Router>
      <Header />  {/* Header tetap di atas */}
      <GlobalWrapper>  {/* Wrapper yang mengatur margin global */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<Detail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/filter-results" element={<FilterResults/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/userlist" element={<UserListAdmin/>} />
          <Route path="/admin/useradd" element={<UserAddAdmin/>} />
          <Route path="/admin/useredit" element={<UserEditAdmin/>} />
        </Routes>
      </GlobalWrapper>
      <Footer />  {/* Footer tetap di bawah */}
      {console.log("Routing to:", window.location.pathname)}
    </Router>
  );
}

export default App;
