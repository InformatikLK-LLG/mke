import type { NavBarItem, NavBarType } from "./NavBar";

import { NavLink } from "react-router-dom";
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
              {subroutes?.map(
                (subroute, i) =>
                  subroute.name && (
                    <li key={i}>
                      <NavLink to={subroute.path}>{subroute.name}</NavLink>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
