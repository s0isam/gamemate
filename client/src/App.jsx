import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Games from './pages/Games';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindGamers from './pages/FindGamers';
import GamerProfile from './pages/GamerProfile';
import MyTeams from './pages/MyTeams';
import TeamDetails from './pages/TeamDetails';
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="min-h-screen bg-[#050505] text-slate-100">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(223,255,0,0.10),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(255,23,68,0.08),_transparent_24%)]" />
          <div className="relative z-10">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<Games />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/find-gamers"
                  element={
                    <ProtectedRoute>
                      <FindGamers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gamer/:id"
                  element={
                    <ProtectedRoute>
                      <GamerProfile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-teams"
                  element={
                    <ProtectedRoute>
                      <MyTeams />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teams/:teamId"
                  element={
                    <ProtectedRoute>
                      <TeamDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat/:teamId"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
