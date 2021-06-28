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
          path: "/institutions/:instCode",
          heading: "Ändern",
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

    const newPath = route.path.replace(
      route.path.slice(
        startOfParameter,
        endOfParameter === -1 ? route.path.length : endOfParameter
      ),
      location.pathname.slice(
        startOfParameter,
        endOfParameter === -1 ? route.path.length : endOfParameter
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
