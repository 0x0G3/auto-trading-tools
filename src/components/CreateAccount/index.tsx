"use client";

import ProfileSetup from "./ProfileSetup";

// import ProfileSetup from "../src/components/ProfileSetup";

export default function CreateAccount() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Create Your Account</h1>
      <ProfileSetup />
    </div>
  );
}
