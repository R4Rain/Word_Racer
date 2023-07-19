"use client"
import { useState } from "react";
import Link from "next/link";
import { 
  Button, 
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody
} from "@material-tailwind/react";
import {
  TrophyIcon,
  SparklesIcon,
  ChartBarIcon
} from "@heroicons/react/24/solid";
import Footer from "@components/Footer";
import { useSession } from "next-auth/react";

const Home = () => {
  const {data:session, status} = useSession();
  const [openFAQ, setOpenFAQ] = useState(0);
  const handleOpenFAQ = (value) => {
    setOpenFAQ(openFAQ === value ? 0 : value);
  };

  return (
    <section className='w-full relative z-40'>
      <div className="px-10 py-6 lg:px-24 lg:py-16">
        <div className="grid mx-auto px-6 py-8 lg:grid-cols-12 lg:gap-8">
            <div className="mr-auto place-self-center lg:col-span-7">
              <Typography variant="h1" className="mb-4 max-w-2xl text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl drop-shadow" color="blue">
                Elevate Your Speed and Accuracy to New Heights
              </Typography>
              <Typography variant="paragraph" className="mb-4 max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl"> 
                Our website is your ultimate destination to master the art of typing faster than ever before. 
                Whether you're a student, professional, or simply looking to improve your typing skills,
                we're here to help you unleash your full potential.
              </Typography>
              { (status !== "loading" && !session?.user) && 
                <Link href="/auth/signup">
                  <Button variant="gradient" color="blue" className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-center text-white rounded-lg normal-case shadow-lg">
                    Get started
                  </Button>
                </Link>
              }
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex lg:justify-start lg:items-center relative">
              <img
                src="/assets/image1.png"
                alt="Main image"
                className="w-full h-full object-cover bg-blue-100 rounded-lg z-40 shadow-lg"
              />
              <div className="w-full h-full absolute left-5 bottom-5 bg-blue-200 rounded-lg z-10 shadow-lg"/>
            </div>
        </div>  
      </div>

      <div className="bg-blue-300 rounded-b-3xl">
        <div className="px-10 lg:px-24 lg:py-16">
          <div className="grid mx-auto px-6 py-8 lg:grid-cols-12 lg:gap-8">
            <div className="place-self-center lg:col-span-7 text-gray-50 lg:ml-auto">
              <Typography variant="h1" className="mb-4 max-w-2xl text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl drop-shadow">
                Check out our features
              </Typography>
              <div className="w-full max-w-[25%] mb-6 h-3 bg-gray-50 rounded-3xl shadow"/>
              <div className="w-[25rem]">
              <div className="mt-4 w-full grid gap-4">
                <div className="w-full bg-white rounded-lg px-4 py-3 flex items-center gap-4 shadow">
                  <SparklesIcon className="w-10 h-10 text-orange-300"/>
                  <div>
                    <Typography variant="h5" color="blue-gray">
                      Typing Test
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray">
                      Try and test your speed typing skills
                    </Typography>
                  </div>
                </div>
                <div className="w-full bg-white rounded-lg px-4 py-3 flex items-center gap-4 shadow">
                  <TrophyIcon className="w-10 h-10 text-amber-400"/>
                  <div>
                    <Typography variant="h5" color="blue-gray">
                      Leaderboard
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray">
                      Rise to the top and become the best typer
                    </Typography>
                  </div>
                </div>
                <div className="w-full bg-white rounded-lg px-4 py-3 flex items-center gap-4 shadow">
                  <ChartBarIcon className="w-10 h-10 text-orange-400"/>
                  <div>
                    <Typography variant="h5" color="blue-gray">
                      User statistics
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray">
                      Share your typing skill stats
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="hidden lg:mt-0 lg:col-span-5 lg:flex lg:justify-start lg:items-center relative order-first">
              <img
                src="/assets/image2.png"
                alt="Main image"
                className="w-full h-full object-cover bg-white rounded-lg z-40 shadow-lg"
              />
              <div className="w-full h-full absolute -left-5 -bottom-5 bg-gray-100 rounded-lg z-10 shadow-lg"/>
            </div>
          </div>
        </div>
      </div>
      <div className="px-10 py-24 lg:py-40 lg:px-24 flex justify-center items-center flex-col">
        <div className="mb-12">
          <Typography variant="h1" className="font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl drop-shadow" color="blue">
            Got questions?
          </Typography>
        </div>
        <div className="max-w-5xl w-full">
          <Accordion open={openFAQ === 1}>
            <AccordionHeader onClick={() => handleOpenFAQ(1)}>
              <Typography variant="h4" color="blue-gray" className="drop-shadow-sm">
                How to take the speed typing test?
              </Typography>
            </AccordionHeader>
            <AccordionBody>
              <Typography variant="paragraph" color="blue-gray" className="lg:text-lg md:text-md">
                You can simply click the play button in the navigation bar and then start the test by clicking the start button.
              </Typography>
            </AccordionBody>
          </Accordion>
          <Accordion open={openFAQ === 2}>
            <AccordionHeader onClick={() => handleOpenFAQ(2)}>
              <Typography variant="h4" color="blue-gray" className="drop-shadow-sm">
                How to save my typing test result?
              </Typography>
            </AccordionHeader>
            <AccordionBody>
              <Typography variant="paragraph" color="blue-gray" className="lg:text-lg md:text-md">
                You need to complete the typing test and make sure to sign in before proceeding to take the test.
              </Typography>
            </AccordionBody>
          </Accordion>
          <Accordion open={openFAQ === 3}>
            <AccordionHeader onClick={() => handleOpenFAQ(3)}>
              <Typography variant="h4" color="blue-gray" className="drop-shadow-sm">
                Do I need to sign in to take the test?                
              </Typography>
            </AccordionHeader>
            <AccordionBody>
              <Typography variant="paragraph" color="blue-gray" className="lg:text-lg md:text-md">
                No, it is not neccessary to sign in.
              </Typography>
            </AccordionBody>
          </Accordion>
        </div>
      </div>
      <Footer/>
    </section>
  )
}

export default Home