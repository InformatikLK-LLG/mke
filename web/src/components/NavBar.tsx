import "../styles/NavBar.css";
import { NavLink } from "react-router-dom";

export type NavBarType = { path: string; name: string }[];
type NavBarProps = { routes: NavBarType };

export default function NavBar({ routes }: NavBarProps) {
  return (
    <nav className="navBar">
      {routes.map((route, index) => {
        return (
          <NavLink className="navLink" to={route.path} key={index}>
            {route.name}
          </NavLink>
        );
      })}
    </nav>
  );
}
