import { getServerSession } from "@/lib/auth-cookie";
import dynamic from "next/dynamic";

const NavbarClient = dynamic(() => import("./NavbarClient"), {
  ssr: true
});

export default function Navbar() {
  const session = getServerSession();
  
  const user = session ? {
    name: session.name,
    role: session.role
  } : null;

  return <NavbarClient initialUser={user} />;
}
