export default function About() {
return (
<div className="min-h-screen bg-[#f8f8f6] px-4 py-14 sm:px-6 lg:px-8">
<div className="mx-auto max-w-4xl">
<div className="mb-10 text-center">
<div className="mb-4 inline-flex items-center rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
About MemberHub
</div>

                <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl">
                    Membership made simple
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    MemberHub helps you manage your membership in one place —
                    from picking a plan to keeping track of your payments and
                    renewal dates.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400 text-lg font-black text-black">
                        01
                    </div>

                    <h2 className="mb-3 text-xl font-bold text-black">
                        What we do
                    </h2>

                    <p className="text-sm leading-6 text-slate-500">
                        We built this platform to make membership management
                        simple — for members and staff alike. No confusing
                        spreadsheets, no lost track of who's paid and who
                        hasn't.
                    </p>
                </div>

                <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-yellow-300 hover:shadow-lg">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-lg font-black text-yellow-400">
                        02
                    </div>

                    <h2 className="mb-3 text-xl font-bold text-black">
                        How it works
                    </h2>

                    <p className="text-sm leading-6 text-slate-500">
                        Browse our plans, get signed up by our team, and track
                        your subscription status and payment history right
                        from your account.
                    </p>
                </div>
            </div>

            <div className="mt-6 rounded-2xl bg-yellow-400 p-8 text-center sm:p-10">
                <h2 className="text-2xl font-black text-black">
                    Everything in one place.
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-black/70">
                    Simple tools, clear information, and an easier way to
                    stay on top of your membership.
                </p>
            </div>
        </div>
    </div>
);

}