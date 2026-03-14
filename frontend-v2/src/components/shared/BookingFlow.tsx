"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ChevronRight, Check, Calendar, CreditCard, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingFlowProps {
    isOpen: boolean;
    onClose: () => void;
    vendorName: string;
}

export default function BookingFlow({ isOpen, onClose, vendorName }: BookingFlowProps) {
    const [step, setStep] = useState(1);

    const steps = [
        { title: "Review Details", icon: User },
        { title: "Event Info", icon: Calendar },
        { title: "Payment", icon: CreditCard },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black">Booking with {vendorName}</h3>
                        <p className="text-sm text-brand-muted">Step {step} of 3</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 p-6 pb-0">
                    {steps.map((s, i) => (
                        <div key={i} className="flex-1">
                            <div className={cn(
                                "h-1 rounded-full transition-all duration-500",
                                step > i ? "bg-brand-primary" : "bg-gray-100"
                            )} />
                        </div>
                    ))}
                </div>

                {/* Form Body */}
                <div className="p-8 overflow-y-auto min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                    <h4 className="font-bold mb-4 flex items-center gap-2">
                                        <Check size={18} className="text-emerald-500" /> Professional Service
                                    </h4>
                                    <p className="text-sm text-brand-muted">The vendor will provide high-quality cinematic wedding photography for 8-10 hours.</p>
                                </div>
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="text-xs font-black uppercase text-brand-muted mb-2 block">Special Requests</span>
                                        <textarea className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 min-h-[100px]" placeholder="Anything else we should know?" />
                                    </label>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl border border-gray-200">
                                        <span className="text-[10px] font-black uppercase text-brand-muted block">Event Date</span>
                                        <p className="font-bold">Oct 24, 2026</p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-gray-200">
                                        <span className="text-[10px] font-black uppercase text-brand-muted block">Start Time</span>
                                        <p className="font-bold">04:00 PM</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-200">
                                    <span className="text-[10px] font-black uppercase text-brand-muted block">Venue Address</span>
                                    <p className="font-bold">Palace Grounds, Hyderabad</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center py-10"
                            >
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                                    <Check size={40} strokeWidth={3} />
                                </div>
                                <h4 className="text-2xl font-black mb-2">Ready to book!</h4>
                                <p className="text-brand-muted">A secure payment request will be sent once the vendor confirms availability.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between gap-4">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                        className="px-6 py-4 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    <button
                        onClick={() => step < 3 ? setStep(step + 1) : onClose()}
                        className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 group shadow-lg shadow-brand-primary/20"
                    >
                        {step === 3 ? 'Confirm Booking' : 'Continue'}
                        {step < 3 && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
