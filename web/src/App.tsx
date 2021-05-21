import ProvideAuth from "./hooks/useAuth";
import PrivateRoute from "./components/PrivateRoute";
import Wrapper from "./Wrapper";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <ProvideAuth>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="" element={<Wrapper />}>
              <PrivateRoute path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              {/* 
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />}>
              <Route path="/" element={<Register0 />} />
              <Route path="1" element={<Register1 />} />
              <Route path="2" element={<Register2 />} />
              NEIN
            </Route> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ProvideAuth>
  );
}

export default App;
