import { useState } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { Dashboard } from "./components/Dashboard";
import { EditorScreen } from "./components/EditorScreen";
import { ViewerScreen } from "./components/ViewerScreen";
import type { WorkInstruction } from "./components/mock-data";

type Screen =
  | { name: "login" }
  | { name: "dashboard" }
  | { name: "editor"; wi?: WorkInstruction }
  | { name: "viewer"; wi: WorkInstruction };

export default function App() {
  /* MARKER-MAKE-KIT-INVOKED */
  const [screen, setScreen] = useState<Screen>({ name: "login" });

  if (screen.name === "login") {
    return <LoginScreen onLogin={() => setScreen({ name: "dashboard" })} />;
  }

  if (screen.name === "dashboard") {
    return (
      <Dashboard
        onOpen={(wi) => setScreen({ name: "viewer", wi })}
        onEdit={(wi) => setScreen({ name: "editor", wi })}
        onCreate={() => setScreen({ name: "editor" })}
        onLogout={() => setScreen({ name: "login" })}
      />
    );
  }

  if (screen.name === "editor") {
    return (
      <EditorScreen
        wi={screen.wi}
        onBack={() => setScreen({ name: "dashboard" })}
        onPreview={(wi) => setScreen({ name: "viewer", wi })}
      />
    );
  }

  if (screen.name === "viewer") {
    return (
      <ViewerScreen
        wi={screen.wi}
        onBack={() => setScreen({ name: "dashboard" })}
      />
    );
  }

  return null;
}
