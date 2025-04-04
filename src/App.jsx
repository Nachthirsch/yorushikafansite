import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AlbumPage from "./pages/AlbumPage";
import LyricsPage from "./pages/LyricsPage";
import NewsPage from "./pages/NewsPage";
import AdminPanel from "./components/AdminPanel"; // Updated import
import EditSongPage from "./pages/admin/EditSongPage";
import { AdminProvider } from "./contexts/AdminContext";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import PostDetailPage from "./pages/PostDetailPage";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage"; // Import HomePage
import ScrollToTop from "./components/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SongsPage from "./pages/SongsPage";
import YorucastPage from "./pages/YorucastPage"; // Import halaman Yorucast
import PodcastDetailPage from "./pages/PodcastDetailPage"; // Import halaman detail podcast

const queryClient = new QueryClient();

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop /> {/* Add this component right after Router */}
          <div className={darkMode ? "dark" : {}}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <main>
              {/* Increased padding-top */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/albums" element={<AlbumPage />} />
                <Route path="/songs" element={<SongsPage />} />
                <Route path="/lyrics/:songId" element={<LyricsPage />} />
                <Route
                  path="/lore"
                  element={
                    <ErrorBoundary>
                      <NewsPage />
                    </ErrorBoundary>
                  }
                />
                <Route path="/lore/:postId" element={<PostDetailPage />} />
                {/* Tambahkan rute untuk Yorucast */}
                <Route path="/yorucast" element={<YorucastPage />} />
                <Route path="/yorucast/:episodeId" element={<PodcastDetailPage />} />
                <Route
                  path="/admin/*"
                  element={
                    <AdminProvider>
                      <AdminPanel />
                    </AdminProvider>
                  }
                />
                <Route
                  path="/admin/songs/edit/:songId"
                  element={
                    <AuthGuard>
                      <EditSongPage />
                    </AuthGuard>
                  }
                />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Update AuthGuard component to properly check auth
function AuthGuard({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default App;
