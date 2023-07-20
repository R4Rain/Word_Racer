import AlertProvider from '@components/AlertProvider';
import Navbar from '@components/Navbar';
import AuthProvider from '@components/AuthProvider';
import '@styles/globals.css';

export const metadata = {
  title: "WordRacer",
  description: "Speed typing website"
}

const RootLayout = ({ children }) => {
  return (
    <html lang='en'>
      <AuthProvider>
        <body>
          <AlertProvider>
            <div className='main bg-gray-100'/>
            <Navbar/>
            <main>
              <section className="z-30"> 
                { children }
              </section>
            </main>
          </AlertProvider>
        </body>
      </AuthProvider>
    </html>
  )
}

export default RootLayout