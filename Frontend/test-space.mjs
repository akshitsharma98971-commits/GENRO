
async function testApi() {
  const email = `TestSpace_${Date.now()}@Test.com`;
  
  await fetch("https://genro-backend.onrender.com/api/signup", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: "Space Test", mobile_no: "8881238888",
      email: email, password: "123", class_level: "CLASS 11", board: "CBSE"
    })
  });

  const loginRes = await fetch("https://genro-backend.onrender.com/api/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email + " ", password: "123" }) // ADDED A SPACE
  });

  console.log(`Status: ${loginRes.status}, Body: ${await loginRes.text()}`);
}
testApi();

