"use client";

import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen w-full bg-background">
            {/* Left Side – Premium Visuals (lg+ only) */ }
            <div className="relative hidden h-full w-[40%] flex-col overflow-hidden bg-[#0F1115] lg:flex xl:w-[45%]">
                {/* Modern Mesh Gradient Background */ }
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#3B82F6] opacity-20 blur-[120px]" />
                    <div className="absolute right-[-5%] bottom-[0%] h-[400px] w-[400px] rounded-full bg-[#3B82F6] opacity-10 blur-[100px]" />
                </div>

                {/* Subtle Grid Overlay */ }
                <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-size-[40px_40px] opacity-[0.03]" />

                <div className="relative z-10 flex h-full flex-col justify-between p-16">
                    {/* Brand Logo */ }
                    <motion.div initial={ { opacity: 0 } } animate={ { opacity: 1 } } className="flex items-center gap-2.5">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Logo size="lg" />
                        </Link>
                    </motion.div>

                    {/* Content Section */ }
                    <div>
                        <motion.div
                            initial={ { opacity: 0, y: 20 } }
                            animate={ { opacity: 1, y: 0 } }
                            transition={ { delay: 0.2 } }
                        >
                            <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium tracking-wider text-[#0EA5E9] uppercase">
                                Join the Elite 1%
                            </span>
                            <h2 className="text-5xl leading-[1.1] font-semibold text-white xl:text-6xl">
                                Elevate your <br />
                                <span className="bg-linear-to-r from-[#3B82F6] to-[#0EA5E9] bg-clip-text text-transparent">
                                    digital influence.
                                </span>
                            </h2>
                            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-400">
                                The world’s most powerful social growth engine. Verified results, premium accounts, and
                                unparalleled reach.
                            </p>
                        </motion.div>

                        {/* Social Proof Mini-Card */ }
                        <motion.div
                            initial={ { opacity: 0, scale: 0.9 } }
                            animate={ { opacity: 1, scale: 1 } }
                            transition={ { delay: 0.4 } }
                            className="mt-12 flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 p-4 backdrop-blur-md"
                        >
                            <div className="flex -space-x-2">
                                { [ 1, 2, 3 ].map((i) => (
                                    <div
                                        key={ i }
                                        className="h-8 w-8 rounded-full border-2 border-[#0F1115] bg-slate-800"
                                    />
                                )) }
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-white">4.9/5 Rating</p>
                                <p className="text-xs text-slate-500">Trusted by 50,000+ creators</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer link */ }
                    <div className="text-sm text-slate-500">
                        © 2026 Inventory — The Standard for Inventory Management
                    </div>
                </div>
            </div>

            {/* Right Side – Minimalist Form */ }
            <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto px-6 lg:w-[60%] xl:w-[55%]">
                <div className="w-full max-w-sm">
                    {/* Back to site link - Premium touch */ }
                    <Link
                        href="/"
                        className="group text-primary mb-12 flex items-center gap-2 text-sm transition-colors"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-background shadow-sm transition-all group-hover:border-[#3B82F6] group-hover:text-[#3B82F6]">
                            <ArrowRight size={ 14 } className="rotate-180" />
                        </div>
                        Back to homepage
                    </Link>

                    <div className="rounded-3xl md:p-2">{ children }</div>
                </div>
            </div>
        </div>
    );
};
