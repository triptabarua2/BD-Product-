/**
 * lib/data.ts
 * শুধু utility helper রাখা হয়েছে।
 * প্রোডাক্ট / দামের ডেটার জন্য lib/db.ts দেখুন।
 */

export const formatBDT = (n: number) =>
  new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(n);
