 
import MainLayout from "./components/templates/MainLayout";
import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import Menus from "./pages/Menus";
 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/menus" />} />
          <Route path="/menus" element={<Menus />} />
          <Route path="/properties" element={<div>property</div>} />
          <Route path="/api-list" element={<div>api-list</div>} />
          <Route path="/system-code" element={<div>system-code</div>} />
          <Route path="/users" element={<div>Users</div>} />
          <Route path="/groups" element={<div>groups</div>} />
          <Route path="/analysis" element={<div>analysis</div>} />
          <Route path="/competitors" element={<div>competitors</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
