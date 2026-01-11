import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="nav">
      <div className="navBrand">🎬 StreamList</div>
      <div className="navLinks">
        <NavLink to="/" end className="navLink">StreamList</NavLink>
        <NavLink to="/movies" className="navLink">Movies</NavLink>
        <NavLink to="/cart" className="navLink">Cart</NavLink>
        <NavLink to="/about" className="navLink">About</NavLink>
      </div>
    </nav>
  );
}
