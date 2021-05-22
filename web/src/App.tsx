import ProvideAuth from "./hooks/useAuth";
import PrivateRoute from "./components/PrivateRoute";
import Wrapper from "./Wrapper";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Register1, Register2, Register3 } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
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
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/register" element={<Register />}>
                <Route path="/" element={<Register1 />} />
                <Route path="1" element={<Register2 />} />
                <Route path="2" element={<Register3 />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ProvideAuth>
  );
}

export default App;
