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
        <aside className="min-h-screen w-64 bg-slate-900 px-4 py-6">
            <div className="mb-8 flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                    {title.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs text-slate-400">{subtitle}</p>
                </div>
            </div>

            <nav className="flex flex-col gap-1">
                {links.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                isActive
                                    ? "bg-white text-slate-900"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            <span
                                className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold ${
                                    isActive
                                        ? "bg-indigo-100 text-indigo-600"
                                        : "bg-slate-800 text-slate-400"
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