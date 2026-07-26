
async function testApi() {
  const email = `testuser_${Date.now()}@test.com`;
  const password = "password123";

  console.log("1. Testing Signup...");
  const signupRes = await fetch("https://genro-backend.onrender.com/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: "Test User",
      mobile_no: "9999999999",
      email: email,
      password: password,
      class_level: "CLASS 11",
      board: "CBSE"
    })
  });

  const signupText = await signupRes.text();
  console.log(`Signup Status: ${signupRes.status}`);
  console.log(`Signup Body: ${signupText}`);

  if (signupRes.status !== 200 && signupRes.status !== 201) {
    console.log("Signup failed, aborting login test.");
    return;
  }

  console.log("\n2. Testing Login...");
  const loginRes = await fetch("https://genro-backend.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  const loginText = await loginRes.text();
  console.log(`Login Status: ${loginRes.status}`);
  console.log(`Login Body: ${loginText}`);
}

testApi();

