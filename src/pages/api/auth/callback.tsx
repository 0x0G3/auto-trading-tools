"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";
// import { supabase } from "../src/utils/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        router.push("/?error=Auth failed");
        return;
      }

      const authUser = data.session.user;

      // Check if user exists in public.users
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id, email, username, name")
        .eq("auth_user_id", authUser.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        router.push("/?error=Error checking user");
        return;
      }

      let user;

      if (!existingUser) {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert({
            auth_user_id: authUser.id,
            email: authUser.email,
            username: authUser.user_metadata.preferred_username || "",
            name: authUser.user_metadata.name || "",
          })
          .select()
          .single();

        if (createError) {
          router.push("/?error=Error creating user");
          return;
        }
        user = newUser;

        // Create default free subscription
        const { error: subError } = await supabase
          .from("subscriptions")
          .insert({ user_id: user.id, tier: "free", status: "active" });

        if (subError) {
          router.push("/?error=Error creating subscription");
          return;
        }
      } else {
        // Update last login
        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({ last_login: new Date().toISOString() })
          .eq("auth_user_id", authUser.id)
          .select()
          .single();

        if (updateError) {
          router.push("/?error=Error updating user");
          return;
        }
        user = updatedUser;
      }

      // Redirect to create-account to complete profile
      router.push("/create-account");
    };

    handleCallback();
  }, [router]);

  return <div>Loading...</div>;
}
