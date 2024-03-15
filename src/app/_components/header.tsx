import Link from "next/link";
import Container from "@/app/_components/container";

const Header = () => {
  return (
    <header className="sticky top-0 bg-white shadow-sm py-3">
      <Container>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight">
          <Link href="/" className="hover:underline">
            emm-blog.
          </Link>
        </h2>
      </Container>
    </header>
  );
};

export default Header;
