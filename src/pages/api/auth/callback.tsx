import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabase";
import { useEffect } from "react";

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
      }
    };
  });
}
