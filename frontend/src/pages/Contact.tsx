import { useState } from "react";

export default function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0b0b0f] px-4 py-14 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] animate-blob rounded-full bg-yellow-400/20 blur-[100px]" />
                <div className="absolute -right-40 top-20 h-[28rem] w-[28rem] animate-blob rounded-full bg-amber-500/15 blur-[100px] [animation-delay:2s]" />
                <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] animate-blob rounded-full bg-yellow-300/10 blur-[100px] [animation-delay:4s]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            </div>

            <div className="relative mx-auto max-w-5xl">
                <div className="mb-12 text-center">
                    <div className="mb-4 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-yellow-200 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
                        </span>
                        Get In Touch
                    </div>

                    <h1 className="animate-fade-up text-4xl font-black tracking-tight text-white sm:text-5xl [animation-delay:100ms]">
                        Contact <span className="text-gradient">us</span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl animate-fade-up text-sm leading-6 text-white/50 sm:text-base [animation-delay:200ms]">
                        Have a question, or want to sign up? Send us a message
                        and we'll get back to you soon.
                    </p>
                </div>

                {submitted ? (
                    <div className="mx-auto max-w-lg animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50 backdrop-blur-md">
                        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

                        <div className="p-8 text-center">
                            <div className="mx-auto mb-5 flex h-14 w-14 animate-pop items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-xl font-black text-black shadow-lg shadow-yellow-500/40">
                                ✓
                            </div>

                            <p className="text-lg font-bold text-white">
                                Thanks for reaching out.
                            </p>

                            <p className="mt-2 text-sm text-white/50">
                                We'll get back to you soon.
                            </p>
                        </div>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="group mx-auto max-w-lg animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50 backdrop-blur-md [animation-delay:300ms]"
                    >
                        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400" />

                        <div className="p-7 sm:p-8">
                            <div className="mb-5">
                                <label className="mb-2 block text-sm font-bold text-white/80">
                                    Name
                                </label>

                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="mb-2 block text-sm font-bold text-white/80">
                                    Email
                                </label>

                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-bold text-white/80">
                                    Message
                                </label>

                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-yellow-400 focus:bg-white/[0.06] focus:ring-4 focus:ring-yellow-400/15"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <button
                                type="submit"
                                className="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 py-3 text-sm font-bold text-black shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/50 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-yellow-400/30"
                            >
                                <span className="relative z-10">Send message</span>
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}