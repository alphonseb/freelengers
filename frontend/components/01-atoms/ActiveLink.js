import { useRouter } from "next/router";
import Link from "next/link";

function ActiveLink({ children, href, className, newTab = false }) {
  const isInternalLink = href.startsWith("/");

  // For internal links, use the Next.js Link component
  if (isInternalLink) {
    return (
      <Link href='/[[...slug]]' as={href}>
        <a className={className}>{children}</a>
      </Link>
    );
  }

  // Plain <a> tags for external links
  return (
    <a
      href={href}
      // Change target and rel attributes is newTab is turned on
      target={newTab ? "_blank" : "_self"}
      rel={newTab ? "noopener noreferrer" : ""}
      className={className}
    >
      {children}
    </a>
  );
}

export default ActiveLink;
