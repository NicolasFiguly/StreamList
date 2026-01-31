import { NavLink } from "react-router-dom";

function linkClass({ isActive }) {
  return isActive ? "navLink navLinkActive" : "navLink";
}

export default function NavBar() {
  return (
    <nav className="nav" aria-label="Main navigation">
      <NavLink to="/" className="navBrand">
        🎬 StreamList
      </NavLink>

      <div className="navLinks">
        <NavLink to="/" end className={linkClass}>
          StreamList
        </NavLink>

        <NavLink to="/movies" className={linkClass}>
          Movies
        </NavLink>

        <NavLink to="/cart" className={linkClass}>
          Cart
        </NavLink>

        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
      </div>
    </nav>
  );
}