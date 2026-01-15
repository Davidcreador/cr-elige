import {
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { Analytics } from "@vercel/analytics/next";
import { ElectionsHeader } from "../components/ElectionsHeader";
import { I18nProvider } from "../components/I18nProvider";
import { useI18n } from "../lib/i18n";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "cr-elige | Costa Rica Elections 2026",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        <I18nProvider>
          <AppLayout>{children}</AppLayout>
        </I18nProvider>
      </body>
      <Analytics />
    </html>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const t = useI18n();

  return (
    <div className="min-h-screen flex flex-col">
      <ElectionsHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                cr-elige 2026 - {t.methodology.neutralityCommitment.heading}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t.home.heroSubtitle}
              </p>
            </div>
            <nav className="flex gap-6">
              <Link
                to="/methodology"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {t.nav.methodology}
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </footer>
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
      <Scripts />
    </div>
  );
}
