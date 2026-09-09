import { Link, useLocation } from "react-router-dom";

type SidebarLink = {
    to: string;
    label: string;
    icon: string;
};

type SidebarProps = {
    title: string;
    subtitle: string;
    links: SidebarLink[];
};

export default function Sidebar({ title, subtitle, links }: SidebarProps) {
    const location = useLocation();

return (
    <aside className="min-h-screen w-64 bg-[#171717] px-4 py-6">
        <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-sm font-bold text-black shadow-lg shadow-yellow-400/10">
                {title.charAt(0)}
            </div>

            <div>
                <p className="text-sm font-bold text-white">
                    {title}
                </p>
                <p className="text-xs text-yellow-400/70">
                    {subtitle}
                </p>
            </div>
        </div>

        <nav className="flex flex-col gap-1.5">
            {links.map((link) => {
                const isActive = location.pathname === link.to;

                return (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                            isActive
                                ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/10"
                                : "text-slate-300 hover:bg-yellow-400/10 hover:text-yellow-400"
                        }`}
                    >
                        <span
                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition ${
                                isActive
                                    ? "bg-black text-yellow-400"
                                    : "bg-white/10 text-yellow-400/70 group-hover:bg-yellow-400/20 group-hover:text-yellow-400"
                            }`}
                        >
                            {link.icon}
                        </span>

                        {link.label}
                    </Link>
                );
            })}
        </nav>
    </aside>
);
}