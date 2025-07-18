import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabase";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [username, setUserame] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/?error=Not authenticated");
        return;
      }
      // Pre-fill fields if user data exists
    };
  });

  return <div>hello</div>;
}
