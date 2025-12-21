import React from 'react';
import { Shield, Home, Users, Lock } from 'lucide-react';

const trustPoints = [
  { icon: Shield, label: 'NABL-aligned Diagnostics' },
  { icon: Home, label: 'Home Sample Collection' },
  { icon: Users, label: 'Trusted by Families' },
  { icon: Lock, label: 'Secure & Confidential Reports' },
];

const TrustDivider = () => {
  return (
    <section className="bg-[#F7F9FB] text-[#0F1316] border-t border-[#E5E7EB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-4">
          {trustPoints.map(({ icon: Icon, label }, idx) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm text-slate-700 sm:text-base"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E5E7EB] text-[#00A86B]">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </span>
              <span className="font-medium leading-tight text-slate-800 text-center sm:text-left">{label}</span>
              {idx < trustPoints.length - 1 && (
                <span className="hidden sm:inline-block h-3 w-px bg-[#E5E7EB] mx-2" aria-hidden="true"></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustDivider;
