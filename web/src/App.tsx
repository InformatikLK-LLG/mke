import { BrowserRouter, Route, Routes } from "react-router-dom";
import Institution, {
  CreateInstitution,
  Institutions,
  ViewDetails,
} from "./pages/Institution";
import Register, { Register1, Register2, Register3 } from "./pages/Register";

import { ForgotPassword } from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NoTrespassing from "./components/NoTrespassing";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./components/PrivateRoute";
import ProvideAuth from "./hooks/useAuth";
import { ThemeProvider } from "@material-ui/styles";
import Wrapper from "./Wrapper";
import { createMuiTheme } from "@material-ui/core";

function App() {
  return (
    <ProvideAuth>
      <ThemeProvider
        theme={createMuiTheme({
          palette: {
            primary: { main: "#74C7CD" },
            secondary: { main: "#F0F0F0" },
          },
        })}
      >
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route element={<Wrapper />}>
                <PrivateRoute path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />}>
                  <Route path="/" element={<Register1 />} />
                  <NoTrespassing path="1" element={<Register2 />} />
                  <NoTrespassing path="2" element={<Register3 />} />
                </Route>
                <PrivateRoute path="/institutions" element={<Institution />}>
                  <PrivateRoute path="/" element={<Institutions />} />
                  <PrivateRoute
                    path="/create"
                    element={<CreateInstitution />}
                  />
                  <PrivateRoute path="/:instCode" element={<ViewDetails />} />
                </PrivateRoute>
                <Route path="/*" element={<PageNotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </ProvideAuth>
  );
}

export default App;
