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
    <div className="min-h-screen bg-[#f8f8f6] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
                <div className="mb-4 inline-flex items-center rounded-full bg-yellow-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
                    Get In Touch
                </div>

                <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl">
                    Contact us
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                    Have a question, or want to sign up? Send us a message
                    and we'll get back to you soon.
                </p>
            </div>

            {submitted ? (
                <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="h-1.5 w-full bg-yellow-400" />

                    <div className="p-8 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-xl font-black text-black">
                            ✓
                        </div>

                        <p className="text-lg font-bold text-black">
                            Thanks for reaching out.
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            We'll get back to you soon.
                        </p>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="h-1.5 w-full bg-yellow-400" />

                    <div className="p-7 sm:p-8">
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-bold text-black">
                                Name
                            </label>

                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                                placeholder="Your name"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-bold text-black">
                                Email
                            </label>

                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-bold text-black">
                                Message
                            </label>

                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                                placeholder="How can we help?"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-black py-3 text-sm font-bold text-yellow-400 transition-all duration-200 hover:bg-yellow-400 hover:text-black active:scale-[0.98]"
                        >
                            Send message
                        </button>
                    </div>
                </form>
            )}
        </div>
    </div>
);

}
