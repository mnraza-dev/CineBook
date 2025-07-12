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

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#363636",
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
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />
      </Routes>
      {/* {!isAdminRoute && <Footer />} */}
    </>
  );
};

export default App;
