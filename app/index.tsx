import React, { useState } from "react";
import { Nav } from "@/navigation/Navigation";
import { DBUser } from "./src/models/firebase/TypeFirestoreCtrl";
import { backgroundTask } from "./src/models/firebase/LocalStorageCtrl";
import { NavigationIndependentTree } from "@react-navigation/native";
import "../gesture-handler";
import { registerRootComponent } from "expo";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<"Welcome" | "Home">("Welcome");

  const [user, setUser] = useState<DBUser | null>(null);

  (async () => {
    try {
      if (isLoggedIn == "Home") {
        console.log("Home: for backgroundTask");
        await backgroundTask();
      }
    } catch (error) {
      console.log("Error in background task:", error);
    }
  })();

  return (
    <NavigationIndependentTree>
      <Nav isLoggedIn={isLoggedIn} user={user} setUser={setUser} />
    </NavigationIndependentTree>
  );
}

registerRootComponent(App);
export default App;
