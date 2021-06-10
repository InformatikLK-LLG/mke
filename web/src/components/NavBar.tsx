import "../styles/NavBar.css";

import Dropdown from "./Dropdown";

export interface NavBarItem {
  path: string;
  name: string;
  subroutes?: NavBarType;
}

export interface NavBarType extends Array<NavBarItem> {}

type NavBarProps = { routes: NavBarType };

export default function NavBar({ routes }: NavBarProps) {
  return (
    <nav className="navBar">
      {routes.map((route, index) => {
        return (
          <Dropdown route={route} index={index} subroutes={route.subroutes} />
        );
      })}
    </nav>
  );
}
