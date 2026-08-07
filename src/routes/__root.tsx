import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center px-6 text-center">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
        <span className="h-px w-8 bg-red" />
        <span>404</span>
      </div>
      <h1 className="font-display font-medium tracking-[-0.03em] leading-[0.92] text-[clamp(4rem,12vw,9rem)]">
        Lost.
      </h1>
      <p className="mt-6 font-serif italic text-xl text-ink/60 max-w-sm">
        This page doesn't exist, or was moved.
      </p>
      <div className="mt-10">
        <Link
          to="/"
          className="group relative inline-flex items-center justify-center bg-red text-white px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden"
        >
          <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span className="relative">Back home →</span>
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center px-6 text-center">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
        <span className="h-px w-8 bg-red" />
        <span>Error</span>
      </div>
      <h1 className="font-display font-medium tracking-[-0.02em] text-[clamp(2rem,6vw,4rem)] leading-[1.05]">
        Something broke.
      </h1>
      <p className="mt-6 font-serif italic text-xl text-ink/60 max-w-sm">
        Something went wrong on our end. Try refreshing, or head back home.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="group relative inline-flex items-center justify-center bg-red text-white px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden"
        >
          <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span className="relative">Try again →</span>
        </button>
        <a
          href="/"
          className="group relative inline-flex items-center justify-center border border-ink text-ink px-8 py-4 text-xs uppercase tracking-[0.25em] overflow-hidden"
        >
          <span className="absolute inset-0 bg-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
          <span className="relative group-hover:text-white transition-colors">Go home</span>
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TEDxOrileIganmu · From Orile, to the World." },
      { name: "description", content: "An independently TED-licensed event. 6 March 2027, Rita Lori Event Centre, Surulere, Lagos. One hundred seats." },
      { name: "author", content: "TEDxOrileIganmu" },
      { property: "og:title", content: "TEDxOrileIganmu · From Orile, to the World." },
      { property: "og:description", content: "6 March 2027 · Surulere, Lagos. One day. One hundred seats. Nigerian ideas, on their own terms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@tedxorileiganmu" },
      { name: "twitter:title", content: "TEDxOrileIganmu · From Orile, to the World." },
      { name: "twitter:description", content: "6 March 2027 · Surulere, Lagos. One day. One hundred seats. Nigerian ideas, on their own terms." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/DHnhFEaco8SJVoKbXYj80w5CeTl2/social-images/social-1782705149934-D65D7B35-BD0D-4C4C-8C76-52687B04EC2A.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/DHnhFEaco8SJVoKbXYj80w5CeTl2/social-images/social-1782705149934-D65D7B35-BD0D-4C4C-8C76-52687B04EC2A.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Inter+Tight:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
