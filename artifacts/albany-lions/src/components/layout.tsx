import { Link, useLocation } from "wouter";
import { Menu, Globe, ChevronRight, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { clubInfo } from "@/data/clubData";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import clubLogo from "@assets/WhatsApp_Image_2026-04-16_at_10.35.09_PM_-_Copy_1777727127815.jpeg";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Leadership", href: "/leadership" },
  { name: "Events", href: "/events" },
  { name: "Sponsors", href: "/sponsors" },
  { name: "Gallery", href: "/gallery" },
  { name: "Donate", href: "/donate" },
  { name: "Contact", href: "/contact" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-1.5 px-4 text-sm font-medium flex justify-center items-center gap-2">
        <span className="text-secondary font-bold">&#9670;</span>
        <span>{clubInfo.fullTagline}</span>
        <span className="text-secondary font-bold">&#9670;</span>
        <span className="hidden md:inline text-primary-foreground/70 ml-2">District 20-R2, New York</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={clubLogo}
              alt="Albany Capital Region Lions Club Logo"
              className="h-14 w-14 rounded-full object-cover border-2 border-secondary/40"
            />
            <div className="flex flex-col">
              <span className="font-black text-primary leading-tight text-base md:text-lg">Albany Capital Region</span>
              <span className="text-secondary font-bold text-xs md:text-sm leading-tight tracking-widest uppercase">Lions Club</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary ${location === link.href ? "text-primary border-b-2 border-secondary pb-1 font-bold" : "text-muted-foreground"}`}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/contact">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold" data-testid="nav-join-button">
                Join Us
              </Button>
            </Link>
          </nav>

          {/* Mobile Nav */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary" data-testid="mobile-menu-trigger">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Navigation links for the Albany Capital Region Lions Club website</SheetDescription>
                <div className="flex items-center gap-3 mb-8 mt-2">
                  <img src={clubLogo} alt="Club Logo" className="h-12 w-12 rounded-full object-cover border-2 border-secondary/40" />
                  <div>
                    <div className="font-black text-primary text-sm leading-tight">Albany Capital Region</div>
                    <div className="text-secondary font-bold text-xs tracking-widest uppercase">Lions Club</div>
                  </div>
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-base font-medium px-4 py-3 rounded-lg transition-colors ${location === link.href ? "bg-primary/10 text-primary font-bold" : "text-foreground hover:bg-muted"}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="px-4 mt-4">
                    <Link href="/contact">
                      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
                        Join Us
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground border-t-4 border-secondary pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <img src={clubLogo} alt="Club Logo" className="h-16 w-16 rounded-full object-cover border-2 border-secondary/50" />
              </Link>
              <h3 className="font-bold text-xl mb-1 text-white">{clubInfo.name}</h3>
              <p className="text-secondary font-bold text-sm mb-4 tracking-wide">{clubInfo.fullTagline}</p>
              <p className="text-sm text-primary-foreground/75 leading-relaxed">
                A proud chapter of Lions Clubs International serving the Albany Capital Region since 2026.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white border-b border-primary-foreground/20 pb-2">Quick Links</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/80">
                {navLinks.slice(0, 5).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-secondary transition-colors flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-secondary" /> {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white border-b border-primary-foreground/20 pb-2">Get Involved</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/80">
                {navLinks.slice(5).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-secondary transition-colors flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-secondary" /> {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <a href={clubInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors flex items-center gap-2 text-white font-medium mt-4">
                    <Globe className="h-4 w-4 text-secondary" /> albanylionsclub.org
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white border-b border-primary-foreground/20 pb-2">Contact Us</h4>
              <ul className="space-y-4 text-sm text-primary-foreground/80">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span>{clubInfo.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-secondary shrink-0" />
                  <a href={`mailto:${clubInfo.email}`} className="hover:text-white transition-colors break-all">{clubInfo.email}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-secondary shrink-0" />
                  <a href={`tel:${clubInfo.phone}`} className="hover:text-white transition-colors">{clubInfo.phone}</a>
                </li>
              </ul>

              <div className="flex gap-3 mt-8">
                {clubInfo.facebook && (
                  <a href={clubInfo.facebook} target="_blank" rel="noopener noreferrer" className="bg-primary-foreground/10 hover:bg-secondary hover:text-primary p-2.5 rounded-full transition-all" aria-label="Facebook">
                    <SiFacebook className="h-5 w-5" />
                  </a>
                )}
                {clubInfo.instagram && (
                  <a href={clubInfo.instagram} target="_blank" rel="noopener noreferrer" className="bg-primary-foreground/10 hover:bg-secondary hover:text-primary p-2.5 rounded-full transition-all" aria-label="Instagram">
                    <SiInstagram className="h-5 w-5" />
                  </a>
                )}
                {clubInfo.twitter && (
                  <a href={clubInfo.twitter} target="_blank" rel="noopener noreferrer" className="bg-primary-foreground/10 hover:bg-secondary hover:text-primary p-2.5 rounded-full transition-all" aria-label="Twitter / X">
                    <SiX className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
            <p>&copy; {new Date().getFullYear()} {clubInfo.name}. All rights reserved.</p>
            <p>Lions Clubs International — District 20-R2, New York</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
