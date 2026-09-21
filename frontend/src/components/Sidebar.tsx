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
        <aside className="relative min-h-screen w-64 overflow-hidden border-r border-white/10 bg-[#0b0b0f] px-4 py-6">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-yellow-400/10 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px]" />

            <div className="relative mb-8 flex items-center gap-3 px-2">
                <div className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-transform duration-300 hover:scale-110 hover:rotate-6">
                    {title.charAt(0)}
                    <span className="absolute inset-0 rounded-xl bg-yellow-400/40 blur-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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

            <nav className="relative flex flex-col gap-1.5">
                {links.map((link) => {
                    const isActive = location.pathname === link.to;

                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                                isActive
                                    ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30"
                                    : "text-slate-300 hover:translate-x-1 hover:bg-white/[0.04] hover:text-yellow-300"
                            }`}
                        >
                            {!isActive && (
                                <span className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-yellow-400 to-amber-500 transition-all duration-300 group-hover:h-6" />
                            )}

                            <span
                                className={`relative flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 ${
                                    isActive
                                        ? "bg-black text-yellow-400"
                                        : "bg-white/10 text-yellow-400/70 group-hover:scale-110 group-hover:bg-yellow-400/20 group-hover:text-yellow-400"
                                }`}
                            >
                                {link.icon}
                            </span>

                            <span className="relative">{link.label}</span>

                            {isActive && (
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}