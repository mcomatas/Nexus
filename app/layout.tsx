import Navbar from './components/navbar'
import './ui/global.css'
import { rowdies } from './ui/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={rowdies.style}>
        <Navbar />
          <main>
            {children}
          </main>
      </body>
    </html>
  )
}