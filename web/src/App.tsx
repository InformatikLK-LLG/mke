import { BrowserRouter, Route, Routes } from "react-router-dom";
import Institution, {
  CreateInstitution,
  Institutions,
  ViewDetails,
} from "./pages/Institution";
import { QueryClient, QueryClientProvider } from "react-query";
import Register, { Register1, Register2, Register3 } from "./pages/Register";

import { ForgotPassword } from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NoTrespassing from "./components/NoTrespassing";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./components/PrivateRoute";
import ProvideAuth from "./hooks/useAuth";
import { ThemeProvider } from "@material-ui/styles";
import Wrapper from "./Wrapper";
import { createMuiTheme } from "@material-ui/core";

function App() {
  const queryClient = new QueryClient();
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
        <QueryClientProvider client={queryClient}>
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
                  <PrivateRoute path="/logout" element={<Logout />} />
                  <PrivateRoute path="/institutions" element={<Institution />}>
                    <PrivateRoute path="/" element={<Institutions />} />
                    <PrivateRoute
                      path="/create"
                      element={<CreateInstitution />}
                    />
                    <PrivateRoute path="/:instCode" element={<ViewDetails />} />
                  </PrivateRoute>
                </Route>
                <PrivateRoute
                  path="/institutions/create"
                  element={<CreateInstitution />}
                />
                <PrivateRoute path="/institutions" element={<Institutions />} />
                <PrivateRoute path="/institutions" element={<Institution />}>
                  <PrivateRoute path="/" element={<Institutions />} />
                  <PrivateRoute
                    path="/create"
                    element={<CreateInstitution />}
                  />
                  <PrivateRoute path="/:instCode" element={<ViewDetails />} />
                </PrivateRoute>
                <Route path="/*" element={<PageNotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </QueryClientProvider>
      </ThemeProvider>
    </ProvideAuth>
  );
}

export default App;
