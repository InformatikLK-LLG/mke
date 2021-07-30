import { BrowserRouter, Route, Routes } from "react-router-dom";
import Customer, {
  CreateCustomer,
  Customers,
  ViewCustomerDetails,
} from "./pages/Customer";
import Institution, {
  CreateInstitution,
  Institutions,
  ViewInstitutionDetails,
} from "./pages/Institution";
import { QueryClient, QueryClientProvider } from "react-query";
import Register, { Register1, Register2, Register3 } from "./pages/Register";
import User, { Users } from "./pages/User";

import AuthenticationRoute from "./components/AuthenticationRoute";
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
import { createTheme } from "@material-ui/core";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 1 } },
  });
  return (
    <ProvideAuth>
      <ThemeProvider
        theme={createTheme({
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
                  <AuthenticationRoute path="/login" element={<Login />} />
                  <AuthenticationRoute
                    path="/forgotpassword"
                    element={<ForgotPassword />}
                  />
                  <AuthenticationRoute path="/register" element={<Register />}>
                    <Route path="/" element={<Register1 />} />
                    <NoTrespassing path="1" element={<Register2 />} />
                    <NoTrespassing path="2" element={<Register3 />} />
                  </AuthenticationRoute>
                  <PrivateRoute path="/logout" element={<Logout />} />
                  <PrivateRoute
                    path="/institutions"
                    element={<Institution />}
                    requiredPrivilege="INSTITUTION_READ"
                  >
                    <PrivateRoute path="/" element={<Institutions />} />
                    <PrivateRoute
                      path="/create"
                      element={<CreateInstitution />}
                      requiredPrivilege="INSTITUTION_WRITE"
                    />
                    <PrivateRoute
                      path="/:instCode"
                      element={<ViewInstitutionDetails />}
                      requiredPrivilege={["INSTITUTION_READ", "CUSTOMER_READ"]}
                    />
                  </PrivateRoute>
                  <PrivateRoute
                    path="/customers"
                    element={<Customer />}
                    requiredPrivilege="CUSTOMER_READ"
                  >
                    <PrivateRoute path="/" element={<Customers />} />
                    <PrivateRoute
                      path="/create"
                      element={<CreateCustomer />}
                      requiredPrivilege="CUSTOMER_WRITE"
                    />
                    <PrivateRoute
                      path="/:id"
                      element={<ViewCustomerDetails />}
                      requiredPrivilege={["CUSTOMER_READ", "INSTITUTION_READ"]}
                    />
                  </PrivateRoute>
                  <Route path="*" element={<PageNotFound />} />
                  <PrivateRoute
                    path="/users"
                    element={<User />}
                    requiredPrivilege="USER_READ"
                  >
                    <PrivateRoute path="/" element={<Users />} />
                  </PrivateRoute>
                </Route>
              </Routes>
            </BrowserRouter>
          </div>
        </QueryClientProvider>
      </ThemeProvider>
    </ProvideAuth>
  );
}

export default App;
