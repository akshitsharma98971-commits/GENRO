
async function testApi() {
  const email = `TestSame_${Date.now()}@Test.com`;
  const mobile = `6${Math.floor(Math.random() * 1000000000)}`;
  
  console.log("Signup 1...");
  await fetch("https://genro-backend.onrender.com/api/signup", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: "Test Same", mobile_no: mobile,
      email: email, password: "123", class_level: "CLASS 11", board: "CBSE"
    })
  });

  console.log("Signup 2 with EXACT SAME details...");
  const signup2 = await fetch("https://genro-backend.onrender.com/api/signup", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: "Test Same", mobile_no: mobile,
      email: email, password: "123", class_level: "CLASS 11", board: "CBSE"
    })
  });
  console.log(`Signup 2 Status: ${signup2.status}, Body: ${await signup2.text()}`);

  console.log("Login with same details...");
  const loginRes = await fetch("https://genro-backend.onrender.com/api/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: "123" })
  });
  console.log(`Login Status: ${loginRes.status}, Body: ${await loginRes.text()}`);
}
testApi();

