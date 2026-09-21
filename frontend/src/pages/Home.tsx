import { useEffect, useState } from "react";
import { getAllPlans } from "../api/plan.api";
import { useNavigate } from "react-router-dom";

type Plan = {
  id: number;
  pname: string;
  duration: number;
  price: string;
};

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlan() {
      try {
        const response = await getAllPlans();
        setPlans(response.data.slice(0, 3));
      } catch (error) {
        console.log(error);
      }
    }
    fetchPlan();
  }, []);

  return (
    <div className="flex-1 overflow-hidden bg-[#0b0b0f] text-white">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-yellow-400/30 blur-[100px]" />
          <div className="absolute -right-40 top-20 h-[28rem] w-[28rem] animate-blob rounded-full bg-amber-500/20 blur-[100px] [animation-delay:2s]" />
          <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] animate-blob rounded-full bg-yellow-300/20 blur-[100px] [animation-delay:4s]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-yellow-200 backdrop-blur-md transition hover:border-yellow-400/40 hover:bg-white/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
              </span>
              Simple subscription management
            </div>

            <h1 className="animate-fade-up text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl [animation-delay:100ms]">
              Manage your membership.
              <span className="text-gradient block">Made simple.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl animate-fade-up text-lg leading-8 text-white/60 [animation-delay:200ms]">
              Everything you need to discover plans, manage your subscription,
              and keep track of your payments — all in one place.
            </p>

            <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-4 sm:flex-row [animation-delay:300ms]">
              <button
                onClick={() => navigate(`/plans`)}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 text-sm font-semibold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore plans
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>

              <button
                onClick={() => navigate(`/aboutUs`)}
                className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/50 hover:bg-white/10"
              >
                Learn more
              </button>
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            <div
              onClick={() => navigate(`/plans`)}
              className="group relative animate-fade-up cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/40 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-yellow-500/10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-400/0 blur-3xl transition-all duration-500 group-hover:bg-yellow-400/30" />
              <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                  />
                </svg>
              </div>
              <h3 className="relative text-lg font-semibold text-white transition-colors duration-300 group-hover:text-yellow-300">
                Browse plans
              </h3>
              <p className="relative mt-2 text-sm leading-6 text-white/50 transition-colors duration-300 group-hover:text-white/70">
                Explore available plans and choose the one that fits your needs.
              </p>
              <div className="relative mt-4 inline-flex items-center gap-1 text-xs font-medium text-yellow-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                Learn more
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>

            <div
              onClick={() => navigate(`/my/subscription`)}
              className="group relative animate-fade-up cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md transition-all duration-500 [animation-delay:120ms] hover:-translate-y-2 hover:border-yellow-400/40 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-yellow-500/10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-400/0 blur-3xl transition-all duration-500 group-hover:bg-yellow-400/30" />
              <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="relative text-lg font-semibold text-white transition-colors duration-300 group-hover:text-yellow-300">
                Track your status
              </h3>
              <p className="relative mt-2 text-sm leading-6 text-white/50 transition-colors duration-300 group-hover:text-white/70">
                See your subscription status and always know when it renews.
              </p>
              <div className="relative mt-4 inline-flex items-center gap-1 text-xs font-medium text-yellow-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                Learn more
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>

            <div
              onClick={() => navigate(`/my/payments`)}
              className="group relative animate-fade-up cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md transition-all duration-500 [animation-delay:240ms] hover:-translate-y-2 hover:border-yellow-400/40 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-yellow-500/10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-yellow-400/0 blur-3xl transition-all duration-500 group-hover:bg-yellow-400/30" />
              <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M3 10h18M7 15h2m-6 4h18a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="relative text-lg font-semibold text-white transition-colors duration-300 group-hover:text-yellow-300">
                Manage payments
              </h3>
              <p className="relative mt-2 text-sm leading-6 text-white/50 transition-colors duration-300 group-hover:text-white/70">
                Keep your payment history organized and easy to understand.
              </p>
              <div className="relative mt-4 inline-flex items-center gap-1 text-xs font-medium text-yellow-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                Learn more
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {plans.length > 0 && (
        <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[120px]" />

          <div className="relative mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="animate-fade-up">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
                Membership
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Choose a plan that <span className="text-gradient">works for you</span>
              </h2>
              <p className="mt-3 max-w-2xl text-white/50">
                Flexible options designed to give you exactly what you need.
              </p>
            </div>

            <button
              onClick={() => navigate(`/plans`)}
              className="group w-fit text-sm font-semibold text-yellow-400 transition hover:text-yellow-300"
            >
              View all plans
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                onClick={() => navigate(`/checkout/${plan.id}`)}
                style={{ animationDelay: `${index * 120}ms` }}
                className={`group relative animate-fade-up cursor-pointer overflow-hidden rounded-2xl border p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 ${
                  index === 1
                    ? "border-yellow-400/60 bg-gradient-to-b from-yellow-400/[0.08] to-transparent shadow-2xl shadow-yellow-500/20"
                    : "border-white/10 bg-white/[0.03] hover:border-yellow-400/40"
                }`}
              >
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                {index === 1 && (
                  <div className="absolute right-5 top-5 animate-pop rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 text-xs font-bold text-black shadow-lg shadow-yellow-500/40">
                    ✦ Popular
                  </div>
                )}

                <div className="relative mb-8">
                  <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-yellow-300">
                    {plan.pname}
                  </h3>
                  <p className="mt-2 text-sm text-white/40 transition-colors duration-300 group-hover:text-white/60">
                    {plan.duration} days
                  </p>
                </div>

                <div className="relative mb-8">
                  <span className="text-4xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-yellow-300">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-sm text-white/40">
                    / {plan.duration} days
                  </span>
                </div>

                <div className="relative mb-8 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-white/60 transition-colors duration-300 group-hover:text-white/80">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400/15 text-xs font-bold text-yellow-400 transition group-hover:bg-yellow-400/25">
                      ✓
                    </span>
                    Easy subscription management
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/60 transition-colors duration-300 group-hover:text-white/80">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400/15 text-xs font-bold text-yellow-400 transition group-hover:bg-yellow-400/25">
                      ✓
                    </span>
                    Clear payment tracking
                  </div>
                </div>

                <button
                  className={`relative w-full overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                    index === 1
                      ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/50"
                      : "border border-white/15 bg-white/5 text-white hover:border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-300"
                  }`}
                >
                  Choose plan
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}