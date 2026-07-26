
async function testApi() {
  const email1 = `Test1_${Date.now()}@Test.com`;
  const email2 = `Test2_${Date.now()}@Test.com`;
  const mobile = `9${Math.floor(Math.random() * 1000000000)}`;
  
  console.log("Signup 1...");
  await fetch("https://genro-backend.onrender.com/api/signup", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: "Test 1", mobile_no: mobile,
      email: email1, password: "123", class_level: "CLASS 11", board: "CBSE"
    })
  });

  console.log("Signup 2 with same mobile but different email...");
  const signup2 = await fetch("https://genro-backend.onrender.com/api/signup", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: "Test 2", mobile_no: mobile,
      email: email2, password: "123", class_level: "CLASS 11", board: "CBSE"
    })
  });
  console.log(`Signup 2 Status: ${signup2.status}, Body: ${await signup2.text()}`);

  console.log("Login with email 2...");
  const loginRes = await fetch("https://genro-backend.onrender.com/api/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email2, password: "123" })
  });
  console.log(`Login Status: ${loginRes.status}, Body: ${await loginRes.text()}`);
}
testApi();

