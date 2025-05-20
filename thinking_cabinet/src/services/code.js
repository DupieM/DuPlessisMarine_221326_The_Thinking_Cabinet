Authservice.js

import bcrypt from 'bcryptjs';

export const loginUser = async (email, enteredPassword) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("User not found");
  }

  const userDoc = querySnapshot.docs[0];
  const userData = userDoc.data();
  const storedHashedPassword = userData.password;

  const passwordMatch = bcrypt.compareSync(enteredPassword, storedHashedPassword);

  if (!passwordMatch) {
    throw new Error("Incorrect password");
  }

  return { id: userDoc.id, ...userData };
};

export const signUpUser = async (name, email, hashedPassword) => {
  const usersRef = collection(db, "users");
  await addDoc(usersRef, {
    name,
    email,
    password: hashedPassword,
    createdAt: new Date()
  });
};

Authentications.js

const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);
await signUpUser(name, email, hashedPassword);

await loginUser(email, password);

// catch (err) {
//   setGeneralError("Incorrect email or password."); // same message for both email and password errors
// }

target="_blank"