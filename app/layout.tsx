import Navbar from './components/navbar'
import './ui/global.css'
import { openSans, inter, rowdies } from './ui/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="min-h-full" lang="en">
      <body className="min-h-full bg-gradient-to-t from-gray-800 to-gray-600 to-50% text-gray-300" style={openSans.style}>
        <Navbar />
          <main>
            {children}
          </main>
      </body>
    </html>
  )
}