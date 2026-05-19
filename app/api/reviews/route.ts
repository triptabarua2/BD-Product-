import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
export async function POST(req:NextRequest){const body=await req.json();const prompt=`Generate bilingual (Bangla + English) review for ${body.productName} with specs ${JSON.stringify(body.specs)} and BDT price context ${JSON.stringify(body.prices)}. Include summary, pros, cons, score/10, value analysis.`; const response=await openai.responses.create({model:'gpt-4.1-mini',input:prompt}); return NextResponse.json({review:response.output_text});}
