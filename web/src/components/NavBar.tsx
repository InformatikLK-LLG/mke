import "../styles/NavBar.css";

import Dropdown from "./Dropdown";

export interface NavBarItem {
  path: string;
  name?: string | JSX.Element;
  subroutes?: NavBarType;
}

export interface NavBarType extends Array<NavBarItem> {}

type NavBarProps = { routes: NavBarType };

export default function NavBar({ routes }: NavBarProps) {
  return (
    <nav className="navBar">
      {routes.map((route, index) => {
        if (route.name)
          return (
            <Dropdown
              key={index}
              route={route}
              index={index}
              subroutes={route.subroutes}
            />
          );
        return undefined;
      })}
    </nav>
  );
}
