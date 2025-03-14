import { Rowdies, Inter, Open_Sans } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'] });
export const rowdies = Rowdies({ 
    weight: ['300', '400', '700'],
    subsets: ['latin']
});
export const openSans = Open_Sans({
    weight: ['300', '400', '700'],
    subsets: ['latin'],
    display: "swap"
})
