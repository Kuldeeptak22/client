import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import ResponsiveAppBar from "./components/Navbar/Navbar";
import AddUserPage from "./pages/AddUserPage";
import UsersListPage from "./pages/UsersListPage";
import PropertyPage from "./pages/PropertyPage";
import AddProperty from "./components/Property/AddProperty";
import EditProperty from "./components/Property/EditProperty";

function App() {
  return (
    <div className="App">
      <Router>
        <ResponsiveAppBar />
        <Routes>
          <Route path="/" index element={<LoginPage />} />
          <Route path="/adduser" element={<AddUserPage />} />
          <Route path="/userlist" element={<UsersListPage />} />
          <Route path="/userlist" element={<UsersListPage />} />
          <Route path="/propertylist" element={<PropertyPage />} />
          <Route path="/addProperty" element={<AddProperty />} />
          <Route path="/editProperty/:propertyId" element={<EditProperty />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
