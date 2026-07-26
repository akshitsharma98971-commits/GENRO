
async function testApi() {
  const email = `TestCase_${Date.now()}@Test.com`;
  
  await fetch("https://genro-backend.onrender.com/api/signup", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: "Pwd Test", mobile_no: "7777777777",
      email: email, password: "CorrectPassword", class_level: "CLASS 11", board: "CBSE"
    })
  });

  const loginRes = await fetch("https://genro-backend.onrender.com/api/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: "WrongPassword" })
  });

  console.log(`Status: ${loginRes.status}, Body: ${await loginRes.text()}`);
}
testApi();

