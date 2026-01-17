import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="nav">
      <div className="navBrand">🎬 StreamList</div>

      <div className="navLinks">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "navLink navLinkActive" : "navLink"
          }
        >
          StreamList
        </NavLink>

        <NavLink
          to="/movies"
          className={({ isActive }) =>
            isActive ? "navLink navLinkActive" : "navLink"
          }
        >
          Movies
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "navLink navLinkActive" : "navLink"
          }
        >
          Cart
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "navLink navLinkActive" : "navLink"
          }
        >
          About
        </NavLink>
      </div>
    </nav>
  );
}