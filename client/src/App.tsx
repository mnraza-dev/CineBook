import ProtectedRoute from "./components/ProtectedRoute";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import SeatLayout from "./pages/SeatLayout";
import Favorite from "./pages/Favorite";
import MyBookings from "./pages/MyBookings";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/admin/Layout";
import AddShows from "./pages/admin/AddShows";
import ListShows from "./pages/admin/ListShows";
import ListBookings from "./pages/admin/ListBookings";
import Dashboard from "./pages/admin/Dashboard";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#000",
            color: "#fff",
          },
        }}
      />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route element={<ProtectedRoute />}><Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} /></Route>
        <Route element={<ProtectedRoute admin />}><Route path="/admin/*" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route></Route>

        <Route path="*" element={<div className="p-24 text-center">Page not found. <a href="/movies">Browse movies</a></div>} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
