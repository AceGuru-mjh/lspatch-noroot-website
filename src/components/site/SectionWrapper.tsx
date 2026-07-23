"use client";

import { motion } from "framer-motion";

interface SectionWrapperProps {
  id: string;
  badge?: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SectionWrapper({
  id,
  badge,
  badgeColor = "#6DBA95",
  title,
  subtitle,
  children,
}: SectionWrapperProps) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mb-10 text-center"
      >
        {badge && (
          <div
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium"
            style={{ borderColor: `${badgeColor}40`, color: badgeColor, background: `${badgeColor}10` }}
          >
            {badge}
          </div>
        )}
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-[13px] text-white/55">{subtitle}</p>
        )}
      </motion.div>
      {children}
    </section>
  );
}
