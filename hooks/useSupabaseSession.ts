import { Session, User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const useSupabaseSession = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    async function fetchSession() {
      const supabaseSession = (await supabase.auth.getSession()).data.session;

      if (supabaseSession?.user?.id) {
        setToken(supabaseSession.access_token);
        setSession(supabaseSession);
      }

      setLoading(false);
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user?.id) {
          setToken(session.access_token);
          setSession(session);
        }
        setLoading(false);
      });
    }
    fetchSession();
  }, [supabase]);
  return {
    isLoading,
    token,
    session,
  };
};
export default useSupabaseSession;
