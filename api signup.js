<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NEON SIGNUP PORTAL — ironbro26fanclub</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Audiowide&display=swap" rel="stylesheet">
<style>
:root { --bg:#000; --neon:#ff0033; }
*{box-sizing:border-box;}
body {
  background: var(--bg);
  color: var(--neon);
  font-family: 'Orbitron', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.container {
  text-align: center;
  padding: 40px;
  border: 1px solid var(--neon);
  border-radius: 12px;
  box-shadow: 0 0 25px var(--neon);
  animation: glowPulse 2s infinite alternate;
}
@keyframes glowPulse {
  from { box-shadow: 0 0 15px var(--neon); }
  to { box-shadow: 0 0 40px var(--neon); }
}
h1 {
  font-family: 'Audiowide', cursive;
  color: var(--neon);
  margin-bottom: 20px;
  text-shadow: 0 0 15px var(--neon);
}
input {
  background: black;
  color: white;
  border: 1px solid var(--neon);
  padding: 10px;
  border-radius: 8px;
  width: 250px;
  margin: 10px 0;
  outline: none;
  box-shadow: 0 0 10px var(--neon);
}
button {
  background: var(--neon);
  color: black;
  font-weight: 700;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
button:hover {
  background: black;
  color: var(--neon);
  box-shadow: 0 0 20px var(--neon);
}
</style>
</head>
<body>
<div class="container">
  <h1>NEON SIGNUP PORTAL</h1>
  <form id="signupForm">
    <input type="email" id="email" placeholder="Email" required><br>
    <input type="password" id="password" placeholder="Passcode" required><br>
    <button type="submit">SIGN UP</button>
  </form>
</div>

<script>
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message);
});
</script>
</body>
</html>
