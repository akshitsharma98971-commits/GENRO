
async function testApi() {
  const email = `TestCase_${Date.now()}@Test.com`;
  
  console.log("Signup with uppercase email...");
  await fetch("https://genro-backend.onrender.com/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: "Case Test", mobile_no: "8888888888",
      email: email, password: "123", class_level: "CLASS 11", board: "CBSE"
    })
  });

  console.log("Login with lowercase email...");
  const loginRes = await fetch("https://genro-backend.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.toLowerCase(), password: "123" })
  });

  console.log(`Login Status: ${loginRes.status}`);
  console.log(`Login Body: ${await loginRes.text()}`);
}

testApi();

