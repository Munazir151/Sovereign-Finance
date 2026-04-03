'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function AnimatedCounter({ value }: { value: number }) {
  // Use a local state for the initial render to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  // Spring config for a satisfying counter animation
  const spring = useSpring(0, { mass: 0.8, stiffness: 50, damping: 15 });
  
  // Transform the spring value into a formatted currency string
  const display = useTransform(spring, (current) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(current)
  );

  useEffect(() => {
    setMounted(true);
    spring.set(value);
  }, [spring, value]);

  // Before hydration, render the exact string to avoid mismatches
  if (!mounted) {
    return <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)}</span>;
  }

  return <motion.span>{display}</motion.span>;
}
