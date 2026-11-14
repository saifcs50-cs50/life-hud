import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Trackers } from "./pages/Trackers";
import { BossFights } from "./pages/BossFights";
import { TrophyRoom } from "./pages/TrophyRoom";
import { Qualifying } from "./pages/Qualifying";
import { Reports } from "./pages/Reports";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="trackers" element={<Trackers />} />
        <Route path="boss-fights" element={<BossFights />} />
        <Route path="trophy-room" element={<TrophyRoom />} />
        <Route path="qualifying" element={<Qualifying />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;
