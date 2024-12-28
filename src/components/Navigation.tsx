import { useState } from "react";
import Link from "next/link";
import { GiCoffeeBeans } from "react-icons/gi";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Produk", href: "/coffee" },
  { name: "Pesanan", href: "/order" },
  { name: "Logout", href: "/logout" },
];

interface Props {
  children?: React.ReactNode;
  title?: string;
  childredHeader?: React.ReactNode;
}

const Navigation = ({ children, title, childredHeader }: Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex flex-col w-64 bg-neutral-900 text-secondary p-4 space-y-6 fixed h-full top-0 left-0">
        <div className="flex flex-row items-center justify-center gap-2 w-full my-4">
          <GiCoffeeBeans className="w-8 h-8 text-secondary" />
          <h1 className="text-secondary text-lg font-black">BIJIKOPI.KU</h1>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 rounded-md bg-secondary px-2 text-black focus:outline-none placeholder:text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex flex-col space-y-4">
          {navItems
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-secondary hover:bg-secondary hover:text-primary px-4 py-2 rounded-md font-semibold ease-in-out duration-300"
              >
                {item.name}
              </Link>
            ))}
        </div>
      </div>

      <div className="flex-1 md:ml-64">
        <div className="md:hidden fixed top-0 left-0 w-full bg-neutral-900 p-4 z-10 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-2 w-full">
              <GiCoffeeBeans className="w-8 h-8 text-secondary" />
              <h1 className="text-secondary text-lg font-black">BIJIKOPI.KU</h1>
            </div>

            <button
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 left-0 w-full bg-neutral-900 p-4 z-20 shadow-md">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-secondary hover:bg-secondary hover:text-primary px-4 py-2 rounded-md font-semibold ease-in-out duration-300 mx-2 my-1"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <main className="p-6 bg-accent mt-16 md:mt-0 flex flex-col min-h-screen">
          <div className="flex flex-col md:flex-row gap-2 justify-between md:items-center items-start md:justify-between w-full mb-4 mt-8">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold">
              {title}
            </h1>

            {childredHeader}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navigation;
