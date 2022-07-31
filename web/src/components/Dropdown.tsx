import { NavBarItem, NavBarType, userCanAccessRoute } from "./NavBar";

import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

export default function Dropdown({
  route,
  index,
  subroutes,
}: {
  route: NavBarItem;
  index: number;
  subroutes?: NavBarType;
}) {
  const [isActive, setIsActive] = useState(false);
  const { user } = useAuth();
  const userPrivileges = user?.roles;

  return (
    <>
      <div
        className="dropdown-unit"
        onMouseLeave={() => {
          setIsActive(false);
        }}
      >
        <NavLink
          className="navLink"
          to={route.path}
          key={route.path}
          onMouseOver={() => {
            setIsActive(true);
          }}
          end={!subroutes}
        >
          {route.name}
        </NavLink>
        {isActive && (
          <div className="dropdown-items">
            <ul>
              {subroutes?.map((subroute, i) => {
                if (userPrivileges && subroute.name) {
                  if (
                    !subroute.privileges ||
                    userCanAccessRoute(userPrivileges, subroute)
                  ) {
                    return (
                      <li key={i}>
                        <NavLink to={subroute.path}>{subroute.name}</NavLink>
                      </li>
                    );
                  }
                }
                return undefined;
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
