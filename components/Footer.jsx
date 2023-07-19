import { Button, Typography } from '@material-tailwind/react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className="bg-blue-300">
      <div className="px-10 py-6">
        <div className="flex flex-row lg:flex-col justify-between items-center gap-4">
          <Typography variant="paragraph" className="text-gray-50 font-light text-md">
            © Made by R4Rain.
          </Typography>
          <div className="flex gap-4 md:order-first">
            <Link href="https://www.linkedin.com/in/james-martin-5041ab209/" target="_blank">
              <Button variant="text" className="flex justify-center items-center !p-3">
                <Image src="/assets/linkedin.svg" width={30} height={30} alt="Linkedin" />
              </Button>
            </Link>
            <Link href="https://www.instagram.com/james.mrtin" target="_blank">
              <Button variant="text" className="flex justify-center items-center !p-3">
                <Image src="/assets/instagram.svg" width={30} height={30} alt="Instagram" />
              </Button>
            </Link>
            <Link href="https://github.com/R4Rain" target="_blank">
              <Button variant="text" className="flex justify-center items-center !p-3">
                <Image src="/assets/github-mark-white.svg" width={30} height={30} alt="Github" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer