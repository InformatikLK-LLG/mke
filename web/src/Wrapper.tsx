import NavBar, { NavBarItem } from "./components/NavBar";
import { Outlet, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "./hooks/useAuth";

interface RouteItem extends NavBarItem {
  heading?: string;
  subroutes?: RouteType;
}

interface RouteType extends Array<RouteItem> {}

export default function Wrapper() {
  const location = useLocation();
  const auth = useAuth();

  const routes: RouteType = [
    {
      path: "/",
      name: "Homie",
      heading: "Home",
      subroutes: [
        {
          path: "/institutions/create",
          name: "Erstellen",
          heading: "Institution erstellen",
        },
        {
          path: "/institutions/create",
          name: "Erstellen",
          heading: "Institution erstellen",
        },
      ],
    },
    {
      path: "/institutions",
      name: "Institutionen",
      heading: "Institutionen",
      subroutes: [
        {
          path: "/institutions/create",
          name: "Erstellen",
          heading: "Institution erstellen",
        },
        {
          path: "/institutions/create",
          name: "Erstellen",
          heading: "Institution erstellen",
        },
        {
          path: "/institutions/create",
          name: "Erstellen",
          heading: "Institution erstellen",
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

  let currentRoute = routes.find((obj) => obj.path === location.pathname);

  if (!currentRoute) {
    routes.forEach(
      (route) =>
        (currentRoute = !currentRoute
          ? route.subroutes?.find(
              (subroute) => subroute.path === location.pathname
            )
          : currentRoute)
    );
  }

  return (
    <div className={`wrapper ${currentRoute ? "hasNavBar" : ""}`}>
      {currentRoute && (
        <div className="header">
          <h1>{currentRoute.heading}</h1>
          <NavBar routes={routes} />
        </div>
      )}
      <Outlet />
    </div>
  );
}
