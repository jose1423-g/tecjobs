import { StyleSheet, View, SafeAreaView } from "react-native";
import Account from "@/components/Account";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import LinkButton from "@/components/LinkButton";

export default function Perfil() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (session) return;

    if (!supabase.auth) {
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [supabase]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {session && session.user ? (
          <Account key={session.user.id} session={session} />
        ) : (          
          <LinkButton
            href="/login"
            label="Iniciar session o registrarse"
            width={250}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
  },
});
