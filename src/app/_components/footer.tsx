import Container from "@/app/_components/container";
import { SITE_NAME } from "@/lib/constants";
import { sns } from "./common/sns";

export function Footer() {
  return (
    <footer className="bg-neutral-800 border-t border-neutral-200">
      <Container>
        <div className="py-10 vstack items-center gap-4">
          <div className="flex gap-4">
            {sns.map(({ href, icon, label }) => (
              <a
                href={href}
                className="text-neutral-200 hover:text-neutral-500 active:text-gray-600 transition duration-100"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                {icon}
              </a>
            ))}
          </div>
          <div className="text-neutral-200 text-sm text-center">
            &copy; {SITE_NAME} All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
