import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabase";

export default function ProfileSetup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
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
      const { data: user } = await supabase
        .from("users ")
        .select("usersname, name")
        .eq("auth_user_id", session.user.id)
        .single();

      if (user) {
        setUsername(user.usersname || "");
      }
    };
    checkUser();
  }, [router]);

  const saveProfile = async () => {
    if (!username || !name) {
      setError("Username and name are required");
      return;
    }

    try {
      setLoading(true);
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) {
        setError("User not authenticated");
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setError("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Complete Your Profile</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="p-2 border rounded"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="p-2 border rounded"
      />
      <button
        onClick={saveProfile}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
