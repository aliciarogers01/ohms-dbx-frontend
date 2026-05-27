import Link from "next/link";
import Image from "next/image";
import "./BottomNavigation.css";

const navItems = [
  { label: "Artists", href: "/artists", icon: "/icons/Artists.png" },
  { label: "Bands", href: "/bands", icon: "/icons/Bands.png" },
  { label: "Albums", href: "/albums", icon: "/icons/Albums.png" },
  { label: "Flyers", href: "/flyers", icon: "/icons/Flyers.png" },
  { label: "Venues", href: "/venues", icon: "/icons/Venues.png" },
  { label: "Labels", href: "/labels", icon: "/icons/Labels.png" },
  { label: "Studios", href: "/studios", icon: "/icons/Studios.png" },
  { label: "Videos", href: "/videos", icon: "/icons/Videos.png" },
  { label: "Books / Zines", href: "/books-zines", icon: "/icons/Books-Zines.png" },
  { label: "Events", href: "/events", icon: "/icons/Events.png" },
  { label: "Family Tree", href: "/family-tree", icon: "/icons/Family Tree.png" },
  { label: "Submit", href: "/submit", icon: "/icons/Donate.png" },
];

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link className="bottom-nav-item" href={item.href} key={item.href}>
          <Image src={item.icon} alt={item.label} width={54} height={54} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}