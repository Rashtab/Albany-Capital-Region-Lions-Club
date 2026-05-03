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
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import CalendarPage from "@/pages/calendar";
import MagazinePage from "@/pages/magazine";

// Admin Pages (no Layout wrapper)
import AdminLogin from "@/pages/admin/login";
import AdminSetup from "@/pages/admin/setup";
import AdminDashboard from "@/pages/admin/index";
import AdminBlog from "@/pages/admin/blog";
import AdminEvents from "@/pages/admin/events";
import AdminMagazine from "@/pages/admin/magazine";
import AdminGallery from "@/pages/admin/gallery";

const queryClient = new QueryClient();

function PublicRouter() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/leadership" component={Leadership} />
        <Route path="/events" component={Events} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/magazine" component={MagazinePage} />
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
          <Switch>
            {/* Admin routes — no Layout */}
            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin/setup" component={AdminSetup} />
            <Route path="/admin/blog" component={AdminBlog} />
            <Route path="/admin/events" component={AdminEvents} />
            <Route path="/admin/magazine" component={AdminMagazine} />
            <Route path="/admin/gallery" component={AdminGallery} />
            <Route path="/admin" component={AdminDashboard} />
            {/* Public routes */}
            <Route component={PublicRouter} />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
