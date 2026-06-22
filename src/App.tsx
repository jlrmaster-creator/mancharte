import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ArtistList } from './pages/artists/ArtistList';
import { ArtistForm } from './pages/artists/ArtistForm';
import { ArtistDetail } from './pages/artists/ArtistDetail';
import { ArtworkList } from './pages/artworks/ArtworkList';
import { ArtworkForm } from './pages/artworks/ArtworkForm';
import { ExhibitionList } from './pages/exhibitions/ExhibitionList';
import { ExhibitionForm } from './pages/exhibitions/ExhibitionForm';
import { ExhibitionDetail } from './pages/exhibitions/ExhibitionDetail';
import { Reports } from './pages/Reports';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/artists" element={<ArtistList />} />
        <Route path="/artists/new" element={<ArtistForm />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
        <Route path="/artists/:id/edit" element={<ArtistForm />} />
        <Route path="/artworks" element={<ArtworkList />} />
        <Route path="/artworks/new" element={<ArtworkForm />} />
        <Route path="/artworks/:id/edit" element={<ArtworkForm />} />
        <Route path="/exhibitions" element={<ExhibitionList />} />
        <Route path="/exhibitions/new" element={<ExhibitionForm />} />
        <Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
