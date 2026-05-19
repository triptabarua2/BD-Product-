import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { ThemeProvider } from 'next-themes';
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang='en'><body><ThemeProvider attribute='class' defaultTheme='light'><Navbar/>{children}</ThemeProvider></body></html>}
