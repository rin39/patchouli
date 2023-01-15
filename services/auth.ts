import clientPromise from "../lib/mongo";
import bcrypt from "bcrypt";
import { Db } from "mongodb";
import { z } from "zod";

let database: Db;

(async () => {
  const client = await clientPromise;
  database = client.db();
})();

const SignupBody = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Username must contain at least 2 characters"),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

type SignupBody = z.infer<typeof SignupBody>;

export class UserAlreadyExistsError extends Error {}

export async function signup(signupBody: SignupBody) {
  SignupBody.parse(signupBody);
  const { username, password, email } = signupBody;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, email, password: hashedPassword };

  const user = await database.collection("users").findOne({ email });
  if (user)
    throw new UserAlreadyExistsError("User with such email already exists");

  await database.collection("users").insertOne(newUser);
}

export async function login(
  credentials: Record<"email" | "password", string> | undefined
) {
  if (!credentials || !credentials.email || !credentials.password)
    throw new Error("No credentials provided");

  const user = await database
    .collection("users")
    .findOne({ email: credentials.email });
  if (!user) throw new Error("No such user");

  if (await bcrypt.compare(credentials.password, user.password)) {
    return {
      username: user.username,
      email: user.email,
      id: user._id.toString(),
    };
  } else {
    throw new Error("Incorrect password");
  }
}
