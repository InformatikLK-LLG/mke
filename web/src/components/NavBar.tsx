import "../styles/NavBar.css";

import { Role, useAuth } from "../hooks/useAuth";

import Dropdown from "./Dropdown";

export interface NavBarItem {
  path: string;
  name?: string | JSX.Element;
  subroutes?: NavBarType;
  privileges?: Array<string> | string;
}

export interface NavBarType extends Array<NavBarItem> {}

type NavBarProps = { routes: NavBarType };

export const userCanAccessRoute = (
  userPrivileges: Array<Role>,
  route: NavBarItem
) =>
  userPrivileges.some((role) =>
    role.privileges.some(
      (privilege) =>
        privilege.id === route.privileges ||
        route.privileges?.includes(privilege.id)
    )
  );

export default function NavBar({ routes }: NavBarProps) {
  const { user } = useAuth();
  // user is always defined since navbar only gets rendered when there is an authenticated user
  const userPrivileges = user?.roles;

  return (
    <nav className="navBar">
      {routes.map((route, index) => {
        if (userPrivileges && route.name) {
          if (!route.privileges || userCanAccessRoute(userPrivileges, route)) {
            return (
              <Dropdown
                key={index}
                route={route}
                index={index}
                subroutes={route.subroutes}
              />
            );
          }
        }
        return undefined;
      })}
    </nav>
  );
}
