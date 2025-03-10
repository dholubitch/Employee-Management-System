const bcrypt = require("bcryptjs");

async function testHash() {
  const password = "admin";
  const newHash = await bcrypt.hash(password, 10);
  console.log("New Hashed Password:", newHash);

  const isMatch = await bcrypt.compare(password, newHash);
  console.log("Does 'admin' match the new hash?", isMatch);
  
  console.log("Stored hash length:", "$2b$10$EupaqdBCGzQzcwiqWWhLh.JrwxHWRVfzX7FveupjoBxjc.VHyjc5m".length);
// Should print true
}

testHash();
