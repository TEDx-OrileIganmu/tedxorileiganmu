import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { VOLUNTEER_ROLES } from "@/lib/volunteer-roles";
import {
  Package,
  ClipboardList,
  Mic,
  Camera,
  Video,
  Share2,
  PenTool,
  Megaphone,
  UserCheck,
  Users,
  Laptop,
  Heart,
  Star,
  Zap,
  Globe,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer · TEDxOrileIganmu" },
      {
        name: "description",
        content:
          "Shape the stage. Join the crew behind TEDxOrileIganmu. 6 March 2027, Surulere, Lagos. 12 roles. One unforgettable day.",
      },
      { property: "og:title", content: "Volunteer · TEDxOrileIganmu" },
      {
        property: "og:description",
        content: "Shape the stage. 12 roles. One day. 6 March 2027.",
      },
    ],
  }),
  component: VolunteerPage,
});

const ease = [0.22, 1, 0.36, 1] as const;

/* ─────────────────────────────────────────
   Role card data
───────────────────────────────────────── */
type RoleCard = {
  role: (typeof VOLUNTEER_ROLES)[number];
  icon: React.ElementType;
  tagline: string;
  description: string;
  dark?: boolean;
};

const ROLE_CARDS: RoleCard[] = [
  {
    role: "Stage & Production Crew",
    icon: Mic,
    tagline: "Own the stage.",
    description:
      "Set the scene literally. You work with the technical team to ensure every light, every mic, every moment lands exactly right.",
    dark: true,
  },
  {
    role: "Photography",
    icon: Camera,
    tagline: "Freeze the moment.",
    description:
      "Capture the exact second an idea lands. Your images become the face of TEDxOrileIganmu long after the day ends.",
  },
  {
    role: "Videography",
    icon: Video,
    tagline: "Tell it in motion.",
    description:
      "Film the talks, the crowd, the behind-the-scenes. Your footage travels further than any single room can hold.",
    dark: true,
  },
  {
    role: "Guest Hospitality & Registration",
    icon: ClipboardList,
    tagline: "First impressions matter.",
    description:
      "You are the first face 100 guests see. A smooth check-in sets the entire emotional tone for the day.",
  },
  {
    role: "Content & Social Media",
    icon: Share2,
    tagline: "Broadcast the room.",
    description:
      "Turn a live event into a global conversation. Real-time posts, stories, and threads that extend the stage far beyond Surulere.",
    dark: true,
  },
  {
    role: "Graphic Design",
    icon: PenTool,
    tagline: "Shape how it looks.",
    description:
      "Design event assets, signage, and digital content that carry the TEDxOrileIganmu identity into every corner of the day.",
  },
  {
    role: "PR & Outreach",
    icon: Megaphone,
    tagline: "Spread the word.",
    description:
      "Build buzz before the curtain rises. You get the right people talking about TEDxOrileIganmu in the right rooms.",
    dark: true,
  },
  {
    role: "Speaker Liaison",
    icon: UserCheck,
    tagline: "Serve the speakers.",
    description:
      "You are the calm in the backstage chaos. Each speaker's single point of contact from arrival to standing ovation.",
  },
  {
    role: "Ushering & Crowd Management",
    icon: Users,
    tagline: "Keep it flowing.",
    description:
      "Guide guests, maintain energy, and ensure the room breathes well throughout the programme.",
    dark: true,
  },
  {
    role: "Logistics & Setup",
    icon: Package,
    tagline: "Build the world.",
    description:
      "The day before the event exists because of you. You transform an empty venue into the stage that ideas deserve.",
  },
  {
    role: "IT / Tech Support",
    icon: Laptop,
    tagline: "Keep it live.",
    description:
      "The screens, the slides, the stream. All of it runs because you are watching every cable and every connection.",
    dark: true,
  },
  {
    role: "Anywhere I'm needed",
    icon: Heart,
    tagline: "Show up fully.",
    description:
      "No ego, no specific title. Just a willingness to do whatever the day demands. These are often our most valuable crew.",
  },
];

/* ─────────────────────────────────────────
   Stats strip data
───────────────────────────────────────── */
const STATS = ["12 roles", "1 day", "6 March 2027", "Surulere, Lagos"];

/* ─────────────────────────────────────────
   Why volunteer benefits
───────────────────────────────────────── */
const BENEFITS = [
  {
    icon: Star,
    title: "Rare access.",
    body: "Get backstage and front-of-house access to one of Lagos's most curated idea events of 2027.",
  },
  {
    icon: Globe,
    title: "Real credit.",
    body: "Your work ships: online, in print, and in the permanent TEDxOrileIganmu archive. Your name on a stage that matters.",
  },
  {
    icon: Zap,
    title: "Build your network.",
    body: "Be in the same room as the speakers, the press, and 100 sharp-minded guests before most people even know this event exists.",
  },
  {
    icon: Heart,
    title: "Lagos needs this.",
    body: "Nigerian ideas deserve a world-class stage. You are not just volunteering at an event. You are helping build something.",
  },
];

/* ─────────────────────────────────────────
   Form state
───────────────────────────────────────── */
type FormData = {
  full_name: string;
  email: string;
  phone: string;
  role: string;
  availability: string;
  experience: string;
  note: string;
};

const EMPTY_FORM: FormData = {
  full_name: "",
  email: "",
  phone: "",
  role: "",
  availability: "",
  experience: "",
  note: "",
};

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
function VolunteerPage() {
  return (
    <SiteLayout>
      <HeroSection />
      <StatsStrip />
      <RolesSection />
      <WhyVolunteerSection />
      <ApplicationForm />
    </SiteLayout>
  );
}

/* ─────────────────────────────────────────
   Hero
───────────────────────────────────────── */
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative bg-ink text-white min-h-[100svh] flex flex-col justify-between overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* Red accent lines */}
      <div className="absolute top-0 left-0 h-px w-32 md:w-56 bg-red" />
      <div className="absolute bottom-0 right-0 h-px w-32 md:w-56 bg-red" />

      {/* Kicker */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.1 }}
        className="mx-auto max-w-7xl w-full px-6 md:px-10 pt-20 md:pt-28"
      >
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.15em] md:tracking-[0.3em] text-white/40">
          <span className="h-px w-8 bg-red shrink-0" />
          <span>Volunteer · TEDxOrileIganmu 2027</span>
        </div>
      </motion.div>

      {/* Main headline */}
      <motion.div style={{ y, opacity }} className="mx-auto max-w-7xl w-full px-6 md:px-10 py-12 md:py-0 flex-1 flex flex-col justify-center">
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="font-display font-medium tracking-[-0.04em] leading-[0.88] text-[clamp(4rem,13vw,11rem)]"
          >
            Shape
          </motion.h1>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.32 }}
          className="font-display font-medium tracking-[-0.04em] leading-[0.88] text-[clamp(4rem,13vw,11rem)] pb-[0.25em]"
        >
          the{" "}
          <span className="font-serif italic font-normal text-red">
            Stage.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.65 }}
          className="mt-10 md:mt-14 font-serif italic text-[clamp(1.25rem,2.8vw,2rem)] text-white/60 max-w-2xl leading-snug"
        >
          The speakers get the spotlight. The crew makes it possible. Join the team behind TEDxOrileIganmu and help build the most ambitious idea event Lagos has seen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.85 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <a
            href="#apply"
            className="group relative inline-flex items-center justify-center bg-red text-white px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden"
          >
            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative group-hover:text-ink transition-colors duration-500">
              Apply now
            </span>
            <ArrowRight className="relative ml-2 h-3.5 w-3.5 group-hover:text-ink transition-colors duration-500" />
          </a>
          <a
            href="#roles"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors"
          >
            See all roles
            <ChevronDown className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="mx-auto max-w-7xl w-full px-6 md:px-10 pb-10 md:pb-12"
      >
        <p className="text-[10px] uppercase tracking-[0.15em] md:tracking-[0.25em] text-white/25 leading-relaxed">
          6 March 2027 · Rita Lori Event Centre · Surulere, Lagos
        </p>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Stats Strip
───────────────────────────────────────── */
function StatsStrip() {
  return (
    <div className="bg-red text-white overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        className="flex whitespace-nowrap"
      >
        {[...STATS, ...STATS, ...STATS, ...STATS].map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-8 py-4 text-[11px] uppercase tracking-[0.3em] font-display shrink-0"
          >
            {s}
            <span className="h-px w-6 bg-white/40" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Roles Section (bento grid)
───────────────────────────────────────── */
function RolesSection() {
  return (
    <section id="roles" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 md:mb-20 grid md:grid-cols-2 gap-8 items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-6"
            >
              <span className="h-px w-8 bg-red" />
              <span>The Roles</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
              className="font-display font-medium tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,6vw,5rem)]"
            >
              Find your{" "}
              <span className="font-serif italic font-normal">place</span>{" "}
              on the crew.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="font-serif italic text-lg md:text-xl text-ink/60 leading-relaxed md:text-right"
          >
            12 roles across every part of the event. Whether you are a camera operator or a complete generalist, there is a place for you.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {ROLE_CARDS.map((card, i) => (
            <RoleCard key={card.role} card={card} index={i} />
          ))}
        </div>

        {/* CTA below grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mt-12 flex items-center justify-center"
        >
          <a
            href="#apply"
            className="group relative inline-flex items-center justify-center bg-ink text-white px-10 py-5 text-xs uppercase tracking-[0.3em] overflow-hidden"
          >
            <span className="absolute inset-0 bg-red translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative">Apply for your role</span>
            <ArrowRight className="relative ml-2 h-3.5 w-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function RoleCard({ card, index }: { card: RoleCard; index: number }) {
  const Icon = card.icon;
  const dark = card.dark;

  return (
    <motion.a
      href="#apply"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease, delay: (index % 3) * 0.07 }}
      className={`group relative flex flex-col justify-between p-8 md:p-10 min-h-[260px] cursor-pointer transition-all duration-500 ${
        dark
          ? "bg-ink text-white hover:bg-red"
          : "bg-paper text-ink hover:bg-ink hover:text-white"
      }`}
    >
      {/* Top accent */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] transition-colors duration-500 ${dark ? "bg-red group-hover:bg-white" : "bg-transparent group-hover:bg-red"}`} />

      <div className="flex items-start justify-between">
        <div
          className={`p-3 border transition-colors duration-500 ${
            dark
              ? "border-white/15 text-white/70 group-hover:border-white/30 group-hover:text-white"
              : "border-border text-ink/50 group-hover:border-white/20 group-hover:text-white/70"
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <ArrowRight
          className={`h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-400 ${dark ? "text-white" : "text-white"}`}
          strokeWidth={1.5}
        />
      </div>

      <div className="mt-auto pt-8">
        <p
          className={`text-[10px] uppercase tracking-[0.3em] mb-3 transition-colors duration-500 ${
            dark ? "text-white/40 group-hover:text-white/60" : "text-muted-foreground group-hover:text-white/50"
          }`}
        >
          {card.tagline}
        </p>
        <h3
          className={`font-display font-medium text-xl md:text-2xl tracking-[-0.02em] leading-tight mb-3 transition-colors duration-500 ${
            dark ? "text-white" : "text-ink group-hover:text-white"
          }`}
        >
          {card.role}
        </h3>
        <p
          className={`text-sm leading-relaxed transition-colors duration-500 ${
            dark ? "text-white/55 group-hover:text-white/75" : "text-ink/60 group-hover:text-white/65"
          }`}
        >
          {card.description}
        </p>
      </div>
    </motion.a>
  );
}

/* ─────────────────────────────────────────
   Why Volunteer Section
───────────────────────────────────────── */
function WhyVolunteerSection() {
  return (
    <section className="bg-red text-white py-24 md:py-36 relative overflow-hidden">
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-white/50 mb-6"
          >
            <span className="h-px w-8 bg-white/60" />
            <span>Why join</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="font-display font-medium tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,6vw,5rem)] max-w-3xl"
          >
            This is not a line on your CV.{" "}
            <span className="font-serif italic font-normal">
              It is a memory.
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease, delay: i * 0.09 }}
                className="bg-red p-8 md:p-10 relative group hover:bg-white/10 transition-colors duration-400"
              >
                <div className="mb-8">
                  <Icon className="h-6 w-6 text-white/60" strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-medium text-xl md:text-2xl tracking-[-0.02em] leading-tight mb-4">
                  {b.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">{b.body}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonial-style pull quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="mt-20 md:mt-24 border-l-2 border-white/30 pl-8 max-w-2xl"
        >
          <p className="font-serif italic text-[clamp(1.4rem,2.8vw,2.2rem)] text-white/90 leading-snug">
            "The room felt electric because every person in it chose to be there. That includes the crew."
          </p>
          <footer className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/40">
            Ekanem Michael, Licensee and Curator
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Application Form
───────────────────────────────────────── */
function ApplicationForm() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const { error } = await supabase.from("volunteer_applications").insert({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      availability: form.availability,
      experience: form.experience,
      note: form.note || null,
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }

    setStatus("success");
  };

  return (
    <section id="apply" className="bg-paper py-24 md:py-36 relative">
      <div className="absolute top-0 left-0 h-px w-40 md:w-72 bg-red" />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start">
          {/* Left column: text */}
          <div className="md:sticky md:top-32">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-6"
            >
              <span className="h-px w-8 bg-red" />
              <span>Apply</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
              className="font-display font-medium tracking-[-0.03em] leading-[0.95] text-[clamp(2.25rem,5vw,4rem)]"
            >
              Ready to{" "}
              <span className="font-serif italic font-normal">
                build this
              </span>{" "}
              with us?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: 0.2 }}
              className="mt-6 font-serif italic text-lg text-ink/60 leading-relaxed"
            >
              Fill in the form. We review every application personally and will reach out before February 2027.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: 0.3 }}
              className="mt-10 space-y-4"
            >
              {[
                "No experience required for most roles",
                "Training provided before event day",
                "Certificate of participation for all crew",
                "Full programme access on the day",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="mt-1 text-red font-display text-xs">✓</span>
                  <span className="text-sm text-ink/70">{point}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: 0.4 }}
              className="mt-12 border border-border p-6"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Questions?</p>
              <a
                href="mailto:tedxorileiganmu@gmail.com"
                className="text-sm text-ink hover:text-red transition-colors border-b border-ink/20 hover:border-red pb-0.5"
              >
                tedxorileiganmu@gmail.com
              </a>
            </motion.div>
          </div>

          {/* Right column: form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <SuccessState key="success" />
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={submit}
                  className="space-y-0 border border-border"
                >
                  {/* Top accent */}
                  <div className="h-[3px] bg-red" />

                  <div className="p-8 md:p-10 space-y-8">
                    {/* Personal info group */}
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">Personal Info</p>
                      <div className="space-y-6">
                        <FormField label="Full Name" required>
                          <input
                            required
                            type="text"
                            value={form.full_name}
                            onChange={set("full_name")}
                            placeholder="Your full name"
                            className="w-full bg-transparent border-b border-ink/20 py-3 text-base focus:outline-none focus:border-red placeholder:text-ink/25 transition-colors"
                          />
                        </FormField>
                        <div className="grid sm:grid-cols-2 gap-6">
                          <FormField label="Email" required>
                            <input
                              required
                              type="email"
                              value={form.email}
                              onChange={set("email")}
                              placeholder="you@email.com"
                              className="w-full bg-transparent border-b border-ink/20 py-3 text-base focus:outline-none focus:border-red placeholder:text-ink/25 transition-colors"
                            />
                          </FormField>
                          <FormField label="Phone">
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={set("phone")}
                              placeholder="+234 ..."
                              className="w-full bg-transparent border-b border-ink/20 py-3 text-base focus:outline-none focus:border-red placeholder:text-ink/25 transition-colors"
                            />
                          </FormField>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border" />

                    {/* Role preference */}
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">Role Preference</p>
                      <FormField label="Which role interests you most?" required>
                        <div className="relative">
                          <select
                            required
                            value={form.role}
                            onChange={set("role")}
                            className="w-full bg-transparent border-b border-ink/20 py-3 text-base focus:outline-none focus:border-red appearance-none cursor-pointer transition-colors pr-8"
                          >
                            <option value="" disabled>Select a role</option>
                            {VOLUNTEER_ROLES.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40 pointer-events-none" />
                        </div>
                      </FormField>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border" />

                    {/* Background */}
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">Your Background</p>
                      <div className="space-y-6">
                        <FormField label="Availability on event day" required>
                          <input
                            required
                            type="text"
                            value={form.availability}
                            onChange={set("availability")}
                            placeholder="e.g. Full day, morning only, flexible..."
                            className="w-full bg-transparent border-b border-ink/20 py-3 text-base focus:outline-none focus:border-red placeholder:text-ink/25 transition-colors"
                          />
                        </FormField>
                        <FormField label="Relevant experience or skills" required>
                          <textarea
                            required
                            rows={3}
                            value={form.experience}
                            onChange={set("experience")}
                            placeholder="Tell us what you bring. No experience required for some roles."
                            className="w-full bg-transparent border-b border-ink/20 py-3 text-base focus:outline-none focus:border-red placeholder:text-ink/25 transition-colors resize-none leading-relaxed"
                          />
                        </FormField>
                        <FormField label="Anything else we should know?">
                          <textarea
                            rows={2}
                            value={form.note}
                            onChange={set("note")}
                            placeholder="Optional. A link, a question, or just something worth mentioning."
                            className="w-full bg-transparent border-b border-ink/20 py-3 text-base focus:outline-none focus:border-red placeholder:text-ink/25 transition-colors resize-none leading-relaxed"
                          />
                        </FormField>
                      </div>
                    </div>

                    {/* Error */}
                    {status === "error" && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red bg-red/5 border border-red/20 px-4 py-3"
                      >
                        {errorMsg || "Something went wrong. Please try again."}
                      </motion.p>
                    )}

                    {/* Submit */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="group relative w-full inline-flex items-center justify-center bg-red text-white py-5 text-xs uppercase tracking-[0.3em] overflow-hidden disabled:opacity-60"
                      >
                        <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                        <span className="relative">
                          {status === "submitting" ? "Sending application..." : "Submit application"}
                        </span>
                        {status !== "submitting" && (
                          <ArrowRight className="relative ml-2 h-3.5 w-3.5" />
                        )}
                      </button>
                      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                        We review every application personally
                      </p>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Bottom CTA strip */}
      <div className="mt-24 md:mt-32 border-t border-border">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="font-display font-medium text-xl md:text-2xl tracking-[-0.02em]">
              Want to attend instead?
            </p>
            <p className="mt-1 text-sm text-ink/60">
              Tickets are available for all three tiers.
            </p>
          </div>
          <Link
            to="/tickets"
            className="group relative inline-flex items-center justify-center border border-ink text-ink px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden self-start md:self-auto"
          >
            <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <span className="relative group-hover:text-white transition-colors duration-300">
              View tickets
            </span>
            <ArrowRight className="relative ml-2 h-3.5 w-3.5 group-hover:text-white transition-colors duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   Success State
───────────────────────────────────────── */
function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease }}
      className="border border-border p-10 md:p-14 text-center relative"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-red" />

      <div className="inline-flex items-center justify-center w-14 h-14 border border-red mb-8">
        <Heart className="h-6 w-6 text-red" strokeWidth={1.5} />
      </div>

      <h3 className="font-display font-medium text-3xl md:text-4xl tracking-[-0.03em] leading-tight mb-4">
        Application{" "}
        <span className="font-serif italic font-normal">received.</span>
      </h3>

      <p className="font-serif italic text-lg text-ink/60 max-w-sm mx-auto leading-relaxed mb-8">
        Thank you for wanting to help shape this. We will review your application and reach out before February 2027.
      </p>

      <div className="flex items-center gap-3 justify-center text-[11px] uppercase tracking-[0.15em] md:tracking-[0.25em] text-muted-foreground">
        <span className="h-px w-8 bg-red shrink-0" />
        <span>TEDxOrileIganmu · 6 March 2027</span>
        <span className="h-px w-8 bg-red shrink-0" />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   FormField
───────────────────────────────────────── */
function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block group">
      <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2.5 group-focus-within:text-red transition-colors">
        {label}
        {required && <span className="ml-1 text-red">*</span>}
      </span>
      {children}
    </label>
  );
}
