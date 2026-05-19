import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/data';
export function GET(req:NextRequest){const q=req.nextUrl.searchParams.get('q')?.toLowerCase()||'';const suggestions=products.filter(p=>p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)).slice(0,8);return NextResponse.json(suggestions);}
