import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabase";
// import { supabase } from "../../src/utils/supabase";

type ResponseData = {
  user?: { id: string; email: string; username?: string; name?: string };
  url?: string;
};
type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, provider, username, name, tier } = req.body as {
    email?: string;
    password?: string;
    provider?: "google";
    username?: string;
    name?: string;
    tier?: "free" | "pro" | "enterprise";
  };

  try {
    if (provider === "google") {
      // Handle Google Sign-On
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${req.headers.origin}/auth/callback` },
      });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Return the OAuth URL for client-side redirect
      return res.status(200).json({ url: data.url });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Handle email/password sign-in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(401).json({ error: "No user found" });
    }

    // Check if user exists in public.users
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id, email, username, name")
      .eq("auth_user_id", data.user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      return res.status(500).json({ error: "Error checking user" });
    }

    let user;

    if (!existingUser) {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          auth_user_id: data.user.id,
          email: data.user.email,
          username,
          name,
        })
        .select()
        .single();

      if (createError) {
        return res.status(500).json({ error: "Error creating user" });
      }
      user = newUser;

      // Create default free subscription
      const { error: subError } = await supabase
        .from("subscriptions")
        .insert({ user_id: user.id, tier: tier || "free", status: "active" });

      if (subError) {
        return res.status(500).json({ error: "Error creating subscription" });
      }
    } else {
      // Update last login
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          last_login: new Date().toISOString(),
          username: username || existingUser.username,
          name: name || existingUser.name,
        })
        .eq("auth_user_id", data.user.id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: "Error updating user" });
      }
      user = updatedUser;
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
