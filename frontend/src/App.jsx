import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/Pipeline";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Deals from "./pages/Deals";

function App() {
  return (
    <div className="flex min-h-screen bg-[#F4F2F5] dark:bg-[#111111]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/pipeline" element={<Pipeline />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
