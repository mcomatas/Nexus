import Navbar from './components/navbar'
import './ui/global.css'
import { openSans } from './ui/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={openSans.style}>
        <Navbar />
          <main>
            {children}
          </main>
      </body>
    </html>
  )
}