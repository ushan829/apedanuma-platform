import { getServerSession } from "@/lib/auth-cookie";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  const session = getServerSession();
  
  const user = session ? {
    name: session.name,
    role: session.role
  } : null;

  return <NavbarClient initialUser={user} />;
}
