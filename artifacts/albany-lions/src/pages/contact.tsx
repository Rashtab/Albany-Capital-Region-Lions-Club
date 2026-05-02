import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { clubInfo } from "@/data/clubData";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "membership", label: "Membership" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "events", label: "Events" },
  { value: "other", label: "Other" },
];

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: ContactForm) {
    console.log("Contact form submitted:", data);
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. A Lions Club representative will be in touch soon.",
    });
    form.reset();
  }

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-primary py-20 px-4 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-secondary font-bold tracking-widest uppercase text-sm">Reach Out</span>
            <h1 className="text-5xl md:text-6xl font-black mt-3 mb-4">Contact Us</h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
            <p className="text-primary-foreground/80 mt-6 max-w-xl mx-auto">
              Whether you want to join, donate, sponsor, or just learn more — we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-14 items-start">
            {/* Contact Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">Get in Touch</span>
              <h2 className="text-3xl font-black text-primary mt-3 mb-8">We'd Love to Hear From You</h2>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4" data-testid="contact-email">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Email</p>
                    <a href={`mailto:${clubInfo.email}`} className="text-foreground font-semibold hover:text-primary transition-colors">
                      {clubInfo.email}
                    </a>
                  </div>
                </div>

                {clubInfo.phone && (
                  <div className="flex items-start gap-4" data-testid="contact-phone">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Phone</p>
                      <a href={`tel:${clubInfo.phone}`} className="text-foreground font-semibold hover:text-primary transition-colors">
                        {clubInfo.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4" data-testid="contact-address">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Location</p>
                    <p className="text-foreground font-semibold">{clubInfo.address}</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Follow Us</p>
                <div className="flex gap-3">
                  {clubInfo.facebook && (
                    <a href={clubInfo.facebook} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                      aria-label="Facebook" data-testid="contact-facebook"
                    >
                      <SiFacebook className="h-5 w-5" />
                    </a>
                  )}
                  {clubInfo.instagram && (
                    <a href={clubInfo.instagram} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                      aria-label="Instagram" data-testid="contact-instagram"
                    >
                      <SiInstagram className="h-5 w-5" />
                    </a>
                  )}
                  {clubInfo.twitter && (
                    <a href={clubInfo.twitter} target="_blank" rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                      aria-label="Twitter / X" data-testid="contact-twitter"
                    >
                      <SiX className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="bg-card border border-card-border rounded-2xl p-8 shadow-sm"
            >
              <h3 className="text-2xl font-black text-foreground mb-6">Send a Message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid="contact-form">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Phone Number <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(518) 555-0100" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-subject">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((s) => (
                            <SelectItem key={s.value} value={s.value} data-testid={`subject-option-${s.value}`}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us how we can help, or introduce yourself..."
                          rows={5}
                          {...field}
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                    data-testid="button-submit"
                  >
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, hsl(48 95% 52%) 0%, transparent 60%)" }} />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Become a Lion?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Use the form above to express your interest in membership, and a club officer will reach out to welcome you.
            </p>
            <div className="text-secondary text-lg font-bold">
              We Serve — and We'd Love to Serve Alongside You.
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
