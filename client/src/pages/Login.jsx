import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    fetch("http://localhost:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid username or password");
        }

        return response.json();
      })
      .then((userData) => {
        setUser(userData);
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <main>
      <h1>StrengthOS</h1>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit">Login</button>
      </form>

      {error && <p>{error}</p>}

      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </main>
  );
}

export default Login;