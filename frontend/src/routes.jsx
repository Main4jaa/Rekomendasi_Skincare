import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import DiagnosisPage from './pages/DiagnosisPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import SkincarePage from './pages/SkincarePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'diagnosis', element: <DiagnosisPage /> },
      { path: 'result', element: <ResultPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'skincare', element: <SkincarePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});
