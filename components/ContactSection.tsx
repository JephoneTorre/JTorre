"use client";

import React, { useState, FormEvent } from "react";

interface ContactSectionProps {
  isDark: boolean;
}

export default function ContactSection({ isDark }: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const email = "jefoni123451@gmail.com";

  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "8501af4b-f4a7-4695-b7e1-ab1af1b642ec");
    // Optionally format subject for the email sent by Web3Forms
    formData.append("subject", `New submission from portfolio: ${formData.get("subject")}`);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });
      
      const result = await res.json();

      if (result.success) {
        setSubmitStatus("success");
        form.reset();
      } else {
        console.error("Web3Forms error:", result);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000); // Reset button state after 5 seconds
    }
  };

  return (
    <section
      id="contact"
      className={`w-full py-20 md:py-32 border-t transition-colors duration-500 ${
        isDark ? "border-zinc-900/80 bg-black/50" : "border-zinc-200 bg-zinc-50/50"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 mb-16">
          <div className="flex items-center gap-3">
            <span
              className={`h-[1px] w-8 ${
                isDark ? "bg-zinc-700" : "bg-zinc-400"
              }`}
            ></span>
            <span
              className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${
                isDark ? "text-zinc-500" : "text-zinc-500"
              }`}
            >
              04 / GET IN TOUCH
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            CONTACT{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDark
                  ? "from-white via-zinc-400 to-zinc-600"
                  : "from-black via-zinc-700 to-zinc-500"
              }`}
            >
              ME
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Info & Links */}
          <div className="flex flex-col gap-8">
            <div>
              <h3 className={`text-2xl font-bold tracking-tight mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
                Let&apos;s build something great together.
              </h3>
              <p className={`text-base font-light leading-relaxed max-w-md ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                I&apos;m currently available for freelance work and full-time opportunities. If you have a project that needs a developer, or just want to say hi, my inbox is always open.
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-4">
              {/* Email */}
              <div 
                className="flex items-center gap-4 group cursor-pointer relative" 
                onClick={handleCopyEmail}
              >
                <div className={`w-12 h-12 rounded-sm border flex items-center justify-center transition-colors duration-300 ${isDark ? "border-zinc-800 bg-zinc-900/50 group-hover:bg-white group-hover:text-black group-hover:border-white" : "border-zinc-200 bg-white group-hover:bg-black group-hover:text-white group-hover:border-black"}`}>
                  {copied ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Email</p>
                    {copied && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">Copied!</span>
                    )}
                  </div>
                  <p className={`text-sm font-medium tracking-wide transition-colors duration-300 ${isDark ? "text-zinc-300 group-hover:text-white" : "text-zinc-700 group-hover:text-black"}`}>
                    {email}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 group">
                <div className={`w-12 h-12 rounded-sm border flex items-center justify-center transition-colors duration-300 ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-white"}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>Location</p>
                  <p className={`text-sm font-medium tracking-wide ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                    Iloilo, Philippines
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="flex items-center">
            <form onSubmit={handleSubmit} className={`w-full p-8 sm:p-10 rounded-sm border backdrop-blur-sm transition-colors duration-500 ${isDark ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className={`w-full h-12 px-4 rounded-sm border outline-none transition-all duration-300 focus:ring-1 ${
                      isDark 
                        ? "bg-black/50 border-zinc-800 text-white focus:border-white focus:ring-white placeholder:text-zinc-700" 
                        : "bg-zinc-50/50 border-zinc-200 text-black focus:border-black focus:ring-black placeholder:text-zinc-400"
                    }`}
                    placeholder="John Doe"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className={`w-full h-12 px-4 rounded-sm border outline-none transition-all duration-300 focus:ring-1 ${
                      isDark 
                        ? "bg-black/50 border-zinc-800 text-white focus:border-white focus:ring-white placeholder:text-zinc-700" 
                        : "bg-zinc-50/50 border-zinc-200 text-black focus:border-black focus:ring-black placeholder:text-zinc-400"
                    }`}
                    placeholder="Project Inquiry"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className={`w-full p-4 rounded-sm border outline-none resize-none transition-all duration-300 focus:ring-1 ${
                      isDark 
                        ? "bg-black/50 border-zinc-800 text-white focus:border-white focus:ring-white placeholder:text-zinc-700" 
                        : "bg-zinc-50/50 border-zinc-200 text-black focus:border-black focus:ring-black placeholder:text-zinc-400"
                    }`}
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`h-12 w-full mt-2 flex items-center justify-center gap-2 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-black text-white hover:bg-zinc-800"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : submitStatus === "success" ? (
                    <span className="text-green-500 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Message Sent!
                    </span>
                  ) : submitStatus === "error" ? (
                    <span className="text-red-500 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      Failed to send
                    </span>
                  ) : (
                    "SEND MESSAGE"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
