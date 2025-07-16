import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { supabase } from "../../utils/supabase";

type GetResponse = {
  wallet_address: string;
  username?: string;
  name?: string;
  linked_accounts: { id: string; account_type: string; account_details: any }[];
  subscription_tier: string;
};
type PostResponse = {
  success: true;
  wallet_address: string;
  username?: string;
  name?: string;
};
type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponse | PostResponse | ErrorResponse>
) {
  if (req.method === "GET") {
    const { wallet } = req.query as { wallet?: string };
    if (!wallet) {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    try {
      // Fetch user data
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, wallet_address, username, name")
        .eq("wallet_address", wallet.toLowerCase())
        .single();

      if (userError || !user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Fetch linked accounts
      const { data: linkedAccounts, error: accountsError } = await supabase
        .from("linked_accounts")
        .select("id, account_type, account_details")
        .eq("user_id", user.id);

      if (accountsError) {
        return res
          .status(500)
          .json({ error: "Error fetching linked accounts" });
      }

      // Fetch subscription tier
      const { data: subscription, error: subError } = await supabase
        .from("subscriptions")
        .select("tier")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (subError && subError.code !== "PGRST116") {
        return res.status(500).json({ error: "Error fetching subscription" });
      }

      return res.status(200).json({
        wallet_address: user.wallet_address,
        username: user.username,
        name: user.name,
        linked_accounts: linkedAccounts || [],
        subscription_tier: subscription?.tier || "free",
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "POST") {
    const { walletAddress, signature, message, linkedAccount, username, name } =
      req.body as {
        walletAddress?: string;
        signature?: string;
        message?: string;
        linkedAccount?: string;
        username?: string;
        name?: string;
      };

    if (!walletAddress || !signature || !message) {
      return res
        .status(400)
        .json({ error: "Wallet address, signature, and message are required" });
    }

    try {
      // Verify signature
      const signerAddress = ethers.verifyMessage(message, signature);
      if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(401).json({ error: "Invalid signature" });
      }

      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id, wallet_address, username, name")
        .eq("wallet_address", walletAddress.toLowerCase())
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        return res.status(500).json({ error: "Error checking user" });
      }

      let user;

      if (!existingUser) {
        // Create new user
        const { data, error } = await supabase
          .from("users")
          .insert({
            wallet_address: walletAddress.toLowerCase(),
            username,
            name,
          })
          .select()
          .single();

        if (error) {
          return res.status(500).json({ error: "Error creating user" });
        }
        user = data;

        // Create default free subscription
        const { error: subError } = await supabase
          .from("subscriptions")
          .insert({ user_id: user.id, tier: "free", status: "active" });

        if (subError) {
          return res.status(500).json({ error: "Error creating subscription" });
        }
      } else {
        // Update user details
        const { data, error } = await supabase
          .from("users")
          .update({
            last_login: new Date().toISOString(),
            username: username || existingUser.username,
            name: name || existingUser.name,
          })
          .eq("wallet_address", walletAddress.toLowerCase())
          .select()
          .single();

        if (error) {
          return res.status(500).json({ error: "Error updating user" });
        }
        user = data;
      }

      // Add linked account if provided
      if (linkedAccount) {
        const { error: accountError } = await supabase
          .from("linked_accounts")
          .insert({
            user_id: user.id,
            account_type: "wallet",
            account_details: { address: linkedAccount.toLowerCase() },
          });

        if (accountError) {
          return res.status(500).json({ error: "Error linking account" });
        }
      }

      return res.status(200).json({
        success: true,
        wallet_address: user.wallet_address,
        username: user.username,
        name: user.name,
      });
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
// import type { NextApiRequest, NextApiResponse } from "next";
// import { ethers, verifyMessage } from "ethers";
// import { supabase } from "../../utils/supabase";
// // import { supabase } from "../../src/utils/supabase";

// type GetResponse = {
//   wallet_address: string;
//   linked_accounts: { id: string; account_type: string; account_details: any }[];
//   subscription_tier: string;
// };
// type PostResponse = { success: true; wallet_address: string };
// type ErrorResponse = { error: string };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<GetResponse | PostResponse | ErrorResponse>
// ) {
//   if (req.method === "GET") {
//     const { wallet } = req.query as { wallet?: string };
//     if (!wallet) {
//       return res.status(400).json({ error: "Wallet address is required" });
//     }

//     try {
//       // Fetch user data
//       const { data: user, error: userError } = await supabase
//         .from("users")
//         .select("id, wallet_address")
//         .eq("wallet_address", wallet.toLowerCase())
//         .single();

//       if (userError || !user) {
//         return res.status(404).json({ error: "User not found" });
//       }

//       // Fetch linked accounts
//       const { data: linkedAccounts, error: accountsError } = await supabase
//         .from("linked_accounts")
//         .select("id, account_type, account_details")
//         .eq("user_id", user.id);

//       if (accountsError) {
//         return res
//           .status(500)
//           .json({ error: "Error fetching linked accounts" });
//       }

//       // Fetch subscription tier
//       const { data: subscription, error: subError } = await supabase
//         .from("subscriptions")
//         .select("tier")
//         .eq("user_id", user.id)
//         .eq("status", "active")
//         .single();

//       if (subError && subError.code !== "PGRST116") {
//         return res.status(500).json({ error: "Error fetching subscription" });
//       }

//       return res.status(200).json({
//         wallet_address: user.wallet_address,
//         linked_accounts: linkedAccounts || [],
//         subscription_tier: subscription?.tier || "free",
//       });
//     } catch (error) {
//       return res.status(500).json({ error: "Server error" });
//     }
//   }

//   if (req.method === "POST") {
//     const { walletAddress, signature, message, linkedAccount } = req.body as {
//       walletAddress?: string;
//       signature?: string;
//       message?: string;
//       linkedAccount?: string;
//     };

//     if (!walletAddress || !signature || !message) {
//       return res
//         .status(400)
//         .json({ error: "Wallet address, signature, and message are required" });
//     }

//     try {
//       // Verify signature
//       const signerAddress = verifyMessage(message, signature);
//       if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
//         return res.status(401).json({ error: "Invalid signature" });
//       }

//       // Check if user exists
//       const { data: existingUser, error: fetchError } = await supabase
//         .from("users")
//         .select("id, wallet_address")
//         .eq("wallet_address", walletAddress.toLowerCase())
//         .single();

//       if (fetchError && fetchError.code !== "PGRST116") {
//         return res.status(500).json({ error: "Error checking user" });
//       }

//       let user;

//       if (!existingUser) {
//         // Create new user
//         const { data, error } = await supabase
//           .from("users")
//           .insert([{ wallet_address: walletAddress.toLowerCase() }])
//           .select()
//           .single();

//         if (error) {
//           return res.status(500).json({ error: "Error creating user" });
//         }
//         user = data;

//         // Create default free subscription
//         const { error: subError } = await supabase
//           .from("subscriptions")
//           .insert({ user_id: user.id, tier: "free", status: "active" });

//         if (subError) {
//           return res.status(500).json({ error: "Error creating subscription" });
//         }
//       } else {
//         // Update last login
//         const { data, error } = await supabase
//           .from("users")
//           .update({ last_login: new Date().toISOString() })
//           .eq("wallet_address", walletAddress.toLowerCase())
//           .select()
//           .single();

//         if (error) {
//           return res.status(500).json({ error: "Error updating user" });
//         }
//         user = data;
//       }

//       // Add linked account if provided
//       if (linkedAccount) {
//         const { error: accountError } = await supabase
//           .from("linked_accounts")
//           .insert({
//             user_id: user.id,
//             account_type: "wallet",
//             account_details: { address: linkedAccount.toLowerCase() },
//           });

//         if (accountError) {
//           return res.status(500).json({ error: "Error linking account" });
//         }
//       }

//       return res
//         .status(200)
//         .json({ success: true, wallet_address: user.wallet_address });
//     } catch (error) {
//       return res.status(500).json({ error: "Server error" });
//     }
//   }

//   return res.status(405).json({ error: "Method not allowed" });
// }
