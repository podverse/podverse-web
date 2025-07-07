import { cookies } from 'next/headers';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import '../styles/globals.css';

export const metadata = {
  title: 'Podverse Web',
  description: 'A Next.js + TypeScript site',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('theme')?.value;
  
  const theme = cookieTheme === 'dark' ? 'dark' : 'light';
  
  return (
    <html lang="en" className={theme === 'dark' ? 'dark' : ''}>
      <body>
        <ThemeToggle initialTheme={theme} />
        {children}
      </body>
    </html>
  );
}
