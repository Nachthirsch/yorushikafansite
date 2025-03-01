import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AlbumPage from "./pages/AlbumPage";
import LyricsPage from "./pages/LyricsPage";
import NewsPage from "./pages/NewsPage";
import AdminPanel from "./components/AdminPanel"; // Updated import

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-24">
          {" "}
          {/* Increased padding-top */}
          <Routes>
            <Route path="/" element={<AlbumPage />} />
            <Route path="/lyrics/:songId" element={<LyricsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
