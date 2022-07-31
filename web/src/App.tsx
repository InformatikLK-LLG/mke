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
import Role, { CreateRole, Roles, ViewRoleDetails } from "./pages/Role";
import User, { Users, ViewUserDetails } from "./pages/User";

import AuthenticationRoute from "./components/AuthenticationRoute";
import { ForgotPassword } from "./pages/ForgotPassword";
import Home from "./pages/Home";
import { Invites } from "./pages/Invite";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NoTrespassing from "./components/NoTrespassing";
import PrivateRoute from "./components/PrivateRoute";
import ProvideAuth from "./hooks/useAuth";
import { ThemeProvider } from "@material-ui/styles";
import Wrapper from "./Wrapper";
import PageNotFound from "./pages/PageNotFound";
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
                  <Route path="/" element={<PrivateRoute />}>
                    <Route path="" element={<Home />} />
                  </Route>
                  <Route path="/logout" element={<PrivateRoute />}>
                    <Route path="" element={<Logout />} />
                  </Route>
                  <Route path="/login" element={<AuthenticationRoute />}>
                    <Route path="" element={<Login />} />
                  </Route>
                  <Route
                    path="/forgotpassword"
                    element={<AuthenticationRoute />}
                  >
                    <Route path="" element={<ForgotPassword />} />
                  </Route>

                  <Route path="/register" element={<AuthenticationRoute />}>
                    <Route path="" element={<Register1 />} />
                    <Route path="1" element={<NoTrespassing />}>
                      <Route path="" element={<Register2 />} />
                    </Route>
                    <Route path="2" element={<NoTrespassing />}>
                      <Route path="" element={<Register3 />} />
                    </Route>
                  </Route>

                  <Route
                    path="/institutions"
                    element={
                      <PrivateRoute requiredPrivilege="INSTITUTION_READ" />
                    }
                  >
                    <Route path="" element={<Institutions />} />
                    <Route
                      path="create"
                      element={
                        <PrivateRoute requiredPrivilege="INSTITUTION_WRITE" />
                      }
                    >
                      <Route path="" element={<CreateInstitution />} />
                    </Route>
                    <Route
                      path=":instCode"
                      element={
                        <PrivateRoute requiredPrivilege="CUSTOMER_READ" />
                      }
                    >
                      <Route path="" element={<ViewInstitutionDetails />} />
                    </Route>
                  </Route>

                  <Route
                    path="/customers"
                    element={<PrivateRoute requiredPrivilege="CUSTOMER_READ" />}
                  >
                    <Route path="" element={<Customers />} />
                    <Route
                      path="create"
                      element={
                        <PrivateRoute requiredPrivilege="CUSTOMER_WRITE" />
                      }
                    >
                      <Route path="" element={<CreateCustomer />} />
                    </Route>
                    <Route
                      path=":id"
                      element={
                        <PrivateRoute requiredPrivilege="INSTITUTION_READ" />
                      }
                    >
                      <Route path="" element={<ViewCustomerDetails />} />
                    </Route>
                  </Route>

                  <Route
                    path="/users"
                    element={<PrivateRoute requiredPrivilege="USER_READ" />}
                  >
                    <Route path="" element={<Users />} />
                    <Route path=":id" element={<ViewUserDetails />} />
                    <Route
                      path="invite"
                      element={
                        <PrivateRoute requiredPrivilege="INVITE_WRITE" />
                      }
                    >
                      <Route path="" element={<Invites />} />
                    </Route>
                  </Route>

                  <Route
                    path="/roles"
                    element={<PrivateRoute requiredPrivilege="ROLE_READ" />}
                  >
                    <Route path="" element={<Roles />} />
                    <Route path=":id" element={<ViewRoleDetails />} />
                    <Route
                      path="create"
                      element={<PrivateRoute requiredPrivilege="ROLE_WRITE" />}
                    >
                      <Route path="" element={<CreateRole />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<PageNotFound />} />
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
