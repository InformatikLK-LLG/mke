import { IconButton, Snackbar } from "@material-ui/core";
import NavBar, { NavBarItem } from "./components/NavBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "./hooks/useAuth";

type HeaderType = {
  header: string;
  setHeader: (header: string) => void;
};

type SnackbarType = {
  isSnackbarOpen: boolean;
  setSnackbarOpen: (isOpen: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
};

interface RouteItem extends NavBarItem {
  heading?: string;
  subroutes?: RouteType;
}

interface RouteType extends Array<RouteItem> {}

const defaultHeader: HeaderType = {
  header: "",
  setHeader: () => {},
};

const defaultSnackbar: SnackbarType = {
  isSnackbarOpen: false,
  setSnackbarOpen: () => {},
  message: "",
  setMessage: () => {},
};

const headerContext = createContext<HeaderType>(defaultHeader);

export const useHeader = () => useContext(headerContext);

function useProvideHeader(): HeaderType {
  const headerArray = useState(defaultHeader.header);

  const setHeader = (header: string) => {
    headerArray[1](header);
  };

  return { header: headerArray[0], setHeader };
}

const snackbarContext = createContext<SnackbarType>(defaultSnackbar);

export const useSnackbar = () => useContext(snackbarContext);

function useProvideSnackbar(): SnackbarType {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setSnackbarMessage] = useState("");

  const setSnackbarOpen = (isOpen: boolean) => setIsSnackbarOpen(isOpen);

  const setMessage = (message: string) => setSnackbarMessage(message);

  return { isSnackbarOpen, setSnackbarOpen, message, setMessage };
}

export default function Wrapper() {
  const location = useLocation();
  const auth = useAuth();
  const header = useProvideHeader();
  const snackbar = useProvideSnackbar();
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await axios.post("http://localhost:8080/profile/refreshToken");
        return axios(originalRequest);
      }
      if (
        error.response.status === 418 &&
        !originalRequest._retry &&
        location.pathname !== "/login"
      ) {
        originalRequest._retry = true;
        auth.signout();
        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  const routes: RouteType = [
    {
      path: "/",
      name: "Homie",
      heading: "Home",
    },
    {
      path: "/institutions",
      name: "Institutionen",
      heading: "Institutionen",
      privileges: "INSTITUTION_READ",
      subroutes: [
        {
          path: "/institutions/create",
          name: "Erstellen",
          heading: "Institution erstellen",
          privileges: "INSTITUTION_WRITE",
        },
        {
          path: "/institutions/:instCode",
          heading: "",
        },
      ],
    },
    {
      path: "/customers",
      name: "Kundinnen",
      heading: "Kundinnen",
      privileges: "CUSTOMER_READ",
      subroutes: [
        {
          path: "/customers/create",
          name: "Erstellen",
          heading: "Kundin erstellen",
          privileges: "CUSTOMER_WRITE",
        },
        {
          path: "/customers/:customerId",
          heading: "",
        },
      ],
    },
    {
      path: "/users",
      name: "Nutzer*innen",
      heading: "Nutzer*innen",
      privileges: "USER_READ",
      subroutes: [
        {
          path: "/users/create",
          name: "Erstellen",
          heading: "Nutzer:in erstellen",
          privileges: "USER_WRITE",
        },
        {
          path: "/users/:userId",
          heading: "",
        },
      ],
    },
    {
      path: "/profile",
      name: <FontAwesomeIcon icon={faUser} />,
      heading: `Hallo ${auth.user?.email}`,
      subroutes: [{ name: "Logout", path: "/logout" }],
    },
  ];

  const isCurrentRoute = (route: RouteItem) => {
    const startOfParameter = route.path.indexOf(":");
    if (startOfParameter === -1) return route.path === location.pathname;

    const endOfParameter = route.path.indexOf("/", startOfParameter);
    const endOfParameterLocation = location.pathname.indexOf(
      "/",
      startOfParameter
    );

    const newPath = route.path.replace(
      route.path.slice(
        startOfParameter,
        endOfParameter === -1 ? route.path.length : endOfParameter
      ),
      location.pathname.slice(
        startOfParameter,
        endOfParameter === -1
          ? location.pathname.length
          : endOfParameterLocation
      )
    );
    return newPath === location.pathname;
  };

  let currentRoute = routes.find((route) => isCurrentRoute(route));

  if (!currentRoute) {
    routes.forEach(
      (route) =>
        (currentRoute = !currentRoute
          ? route.subroutes?.find((subroute) => isCurrentRoute(subroute))
          : currentRoute)
    );
  }

  useEffect(() => {
    currentRoute?.heading && header.setHeader(currentRoute.heading);
    if (currentRoute?.name && typeof currentRoute.name === "string")
      document.title = currentRoute.name;
  }, [currentRoute, header]);

  return (
    <div className={`wrapper ${currentRoute ? "hasNavBar" : ""}`}>
      {currentRoute && (
        <div className="header">
          <h1>{header.header ? header.header : currentRoute.heading}</h1>
          <NavBar routes={routes} />
        </div>
      )}
      <Snackbar
        open={snackbar.isSnackbarOpen}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={() => snackbar.setSnackbarOpen(false)}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        action={
          <IconButton
            size="small"
            onClick={() => snackbar.setSnackbarOpen(false)}
          >
            <FontAwesomeIcon icon={faTimes} style={{ color: "var(--input)" }} />
          </IconButton>
        }
      />
      <headerContext.Provider value={header}>
        <snackbarContext.Provider value={snackbar}>
          <Outlet />
        </snackbarContext.Provider>
      </headerContext.Provider>
    </div>
  );
}
