import { Layout } from "@/components/layout";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/home";
import About from "@/pages/about";
import Leadership from "@/pages/leadership";
import Events from "@/pages/events";
import Sponsors from "@/pages/sponsors";
import Gallery from "@/pages/gallery";
import Donate from "@/pages/donate";
import Contact from "@/pages/contact";
import MagazineAdvertisers from "@/pages/magazine-advertisers";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/leadership" component={Leadership} />
        <Route path="/events" component={Events} />
        <Route path="/sponsors" component={Sponsors} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/donate" component={Donate} />
        <Route path="/contact" component={Contact} />
        <Route path="/sponsors/magazine-advertisers-2026" component={MagazineAdvertisers} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
