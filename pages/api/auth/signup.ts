import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import { signup, UserAlreadyExistsError } from "@/services/auth";

export type Data = {
  message: string;
  errors?: {
    [x: string]: string[] | undefined;
    [x: number]: string[] | undefined;
    [x: symbol]: string[] | undefined;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(404).send({ message: "Not Found" });
  }

  try {
    await signup({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    });
    res.status(200).json({ message: "Successfully signed up" });
  } catch (e) {
    if (e instanceof ZodError) {
      const errors = e.formErrors.fieldErrors;
      return res.status(400).json({ message: "Validation error", errors });
    }
    if (e instanceof UserAlreadyExistsError) {
      return res.status(409).json({ message: e.message });
    }
    res.status(500).json({ message: "Failed to sign up" });
  }
}
