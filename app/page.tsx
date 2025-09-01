"use client";
import Image from "next/image";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import aws_exports from "./aws-exports";
import { useEffect } from "react";
import { listAllUsers } from "./graphql/queries";
import { AuthUser } from "aws-amplify/auth";

// Modifica la config per usare User Pool auth invece di IAM
Amplify.configure(aws_exports);

// Crea il client per le API GraphQL
const client = generateClient();

// Componente separato per la logica autenticata
function AuthenticatedHome({
  signOut,
  user,
}: {
  signOut?: () => void;

  user: AuthUser | undefined;
}) {
  useEffect(() => {
    if (!user) return;

    async function fetchUsers() {
      try {
        console.log("User authenticated, fetching users...");
        const response = await client.graphql({
          query: listAllUsers,
          authMode: "userPool",
        });
        console.log(response.data.listAllUsers);
      } catch (e) {
        console.log("error fetching users", e);
      }
    }

    fetchUsers();
  }, [user]);

  if (!user) return null;
  // Debug: vediamo che tipo è user
  console.log("User object:", user);
  console.log("User keys:", Object.keys(user || {}));

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center ">
      <h1>Hello {user?.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

function Home() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <AuthenticatedHome signOut={signOut} user={user} />
      )}
    </Authenticator>
  );
}

export default Home;
