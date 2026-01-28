import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import ToastProvider from "../components/ToastProvider";
import DashboardPage from "../features/stats/DashboardPage";
import DecksPage from "../features/decks/DecksPage";
import DeckFormPage from "../features/decks/DeckFormPage";
import DeckDetailPage from "../features/decks/DeckDetailPage";
import StudyPage from "../features/study/StudyPage";
import StudyLandingPage from "../features/study/StudyLandingPage";
import SettingsPage from "../features/settings/SettingsPage";

const App = () => {
  return (
    <ToastProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/decks" element={<DecksPage />} />
          <Route path="/decks/new" element={<DeckFormPage />} />
          <Route path="/decks/:id" element={<DeckDetailPage />} />
          <Route path="/study" element={<StudyLandingPage />} />
          <Route path="/study/:deckId" element={<StudyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
};

export default App;
