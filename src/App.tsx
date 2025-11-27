import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ScriptsPage from "./pages/scripts";
import ScriptDetail from "./pages/script-detail";
import VideosPage from "./pages/videos";
import TagsPage from "./pages/tags";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scripts" element={<ScriptsPage />} />
        <Route path="/script/:id" element={<ScriptDetail />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
