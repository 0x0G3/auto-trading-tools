import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabase";

type ResponseData = { user: { id: string; email: string; username?: string; name?: string } };
type ErrorResponse = { error: string };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | ErrorResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json( { error: "Method not allowed" });
    }

    const { email, password, provider, username, name } = req.body as {
        email?: string;
        password?: string;
        provider?: 'google';
        username?: string;
        name?: string;
      };

    try { 
        if (provider === 'google') {
            // handle google sign-in
            const { data, error} = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${req.headers.orgins}/auth/callback`, }
            })
            if (error) {
                return res.status(500).json({ error: error.message });   
            }
            // Note: OAuth redirects to Supabase, so this response won't be reached
            return res.status(200).json({ user: { id: data.user?.id || '', email: data.user?.email || '' } });

        
    }
 }  