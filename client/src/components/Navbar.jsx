import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogout() {
    fetch("http://localhost:5555", {
      method: "DELETE",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        setUser(null);
        navigate("/login");
      }
    });
  }

  return (
    <nav>
      <Link to="/">StrengthOS</Link>

      {user ? (
        <>
          <span>Logged in as {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;