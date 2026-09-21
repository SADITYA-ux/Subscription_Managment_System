export default function About() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0b0b0f] px-4 py-14 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-yellow-400/20 blur-[100px]" />
                <div className="absolute -right-40 top-20 h-[28rem] w-[28rem] animate-blob rounded-full bg-amber-500/15 blur-[100px] [animation-delay:2s]" />
                <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] animate-blob rounded-full bg-yellow-300/10 blur-[100px] [animation-delay:4s]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            </div>

            <div className="relative mx-auto max-w-4xl">
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-yellow-200 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
                        </span>
                        About MemberHub
                    </div>

                    <h1 className="animate-fade-up text-4xl font-black tracking-tight text-white sm:text-5xl [animation-delay:100ms]">
                        Membership made{" "}
                        <span className="text-gradient">simple</span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl animate-fade-up text-sm leading-6 text-white/50 sm:text-base [animation-delay:200ms]">
                        MemberHub helps you manage your membership in one place —
                        from picking a plan to keeping track of your payments and
                        renewal dates.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="group relative animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/40 hover:bg-white/[0.05] hover:shadow-yellow-500/20">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-400/0 blur-3xl transition-all duration-500 group-hover:bg-yellow-400/25" />

                        <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-lg font-black text-black shadow-lg shadow-yellow-500/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                            01
                        </div>

                        <h2 className="relative mb-3 text-xl font-bold text-white transition-colors duration-300 group-hover:text-yellow-300">
                            What we do
                        </h2>

                        <p className="relative text-sm leading-6 text-white/50 transition-colors duration-300 group-hover:text-white/70">
                            We built this platform to make membership management
                            simple — for members and staff alike. No confusing
                            spreadsheets, no lost track of who's paid and who
                            hasn't.
                        </p>
                    </div>

                    <div className="group relative animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-500 [animation-delay:120ms] hover:-translate-y-2 hover:border-yellow-400/40 hover:bg-white/[0.05] hover:shadow-yellow-500/20">
                        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-400/0 blur-3xl transition-all duration-500 group-hover:bg-yellow-400/25" />

                        <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-yellow-400/30 bg-black text-lg font-black text-yellow-400 shadow-lg shadow-black/40 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                            02
                        </div>

                        <h2 className="relative mb-3 text-xl font-bold text-white transition-colors duration-300 group-hover:text-yellow-300">
                            How it works
                        </h2>

                        <p className="relative text-sm leading-6 text-white/50 transition-colors duration-300 group-hover:text-white/70">
                            Browse our plans, get signed up by our team, and track
                            your subscription status and payment history right
                            from your account.
                        </p>
                    </div>
                </div>

                <div className="group relative mt-6 animate-fade-up overflow-hidden rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-yellow-400/15 via-yellow-400/5 to-transparent p-8 text-center shadow-2xl shadow-yellow-500/20 backdrop-blur-md transition-all duration-500 [animation-delay:240ms] hover:-translate-y-1 hover:shadow-yellow-500/30 sm:p-10">
                    <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-yellow-400/20 blur-3xl transition-all duration-500 group-hover:bg-yellow-400/30" />
                    <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-amber-500/20 blur-3xl transition-all duration-500 group-hover:bg-amber-500/30" />

                    <h2 className="relative text-2xl font-black text-white">
                        Everything in <span className="text-gradient">one place</span>.
                    </h2>

                    <p className="relative mx-auto mt-3 max-w-xl text-sm leading-6 text-white/60">
                        Simple tools, clear information, and an easier way to
                        stay on top of your membership.
                    </p>
                </div>
            </div>
        </div>
    );
}