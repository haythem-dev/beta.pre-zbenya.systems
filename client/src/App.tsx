import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Chat from "@/components/Chat";
import { Analytics } from "@vercel/analytics/react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { preferences } = useUserPreferences();
  
  return (
    <QueryClientProvider client={queryClient}>
      <Analytics />
      <div className={preferences.theme === 'dark' ? 'dark' : ''}>
        <Router />
        <Search />
        <div id="chat-container">
          <Chat />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;