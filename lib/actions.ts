"use server";

import db from "@/lib/db";
import { executeAction } from "@/lib/executeAction";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signUp(formData: FormData) {
  return executeAction({
    actionFn: async () => {
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = schema.parse({ email, password });
      
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email: validatedData.email.toLowerCase() }
      });

      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      await db.user.create({
        data: {
          email: validatedData.email.toLowerCase(),
          password: hashedPassword,
        },
      });
    },
  });
}