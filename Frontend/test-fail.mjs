
async function testApi() {
  console.log("Testing Login with wrong credentials...");
  const loginRes = await fetch("https://genro-backend.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "doesnotexist@test.com",
      password: "wrongpassword"
    })
  });

  const loginText = await loginRes.text();
  console.log(`Login Status: ${loginRes.status}`);
  console.log(`Login Body: ${loginText}`);
}

testApi();

