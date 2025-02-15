import type { NextPage } from "next";
import Follow from "../components/Follow";
import { FollowProvider } from "../context/Follow";

const follow: NextPage = () => {
  return (
    <FollowProvider>
      <Follow />
    </FollowProvider>
  );
};

export default follow;
