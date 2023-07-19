"use client"
import { useState, useEffect } from 'react';
import Link from "next/link"
import {
  Navbar,
  Typography,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import {
  Bars2Icon,
  RocketLaunchIcon,
  TrophyIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
  PaperAirplaneIcon,
  ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/outline";

// Components
import ProfileMenu from './ProfileMenu';
import NavList from './NavList';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
 
const CustomNavbar = () => {
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
  const {data: session, status} = useSession();

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  // Nav List
  const navListItems = [
    {
      label: "Play",
      icon: RocketLaunchIcon,
      link: '/play'
    },
    {
      label: "Leaderboard",
      icon: TrophyIcon,
      link: '/leaderboard'
    },
    {
      label: "Feedback",
      icon: ChatBubbleBottomCenterTextIcon,
      link: '/feedback'
    },
  ];

  const handleSignInClick = () => {
    router.push('/auth/signin');
  }

  const handleSignUpClick = () => {
    router.push('/auth/signup');
  }

  const handleProfileClick = () => {
    router.push(`/profile/${session?.user ? session?.user.sub : ""}`);
  }

  const handleSignOutClick = () => {
    signOut();
  }

  const guestMenu = [
    {
      label: "Sign in",
      icon: ArrowLeftOnRectangleIcon,
      handle: handleSignInClick
    },
    {
      label: "Sign up",
      icon: UserPlusIcon,
      handle: handleSignUpClick
    },
  ]

  const userMenu = [
    {
      label: "My Profile",
      icon: UserCircleIcon,
      handle: handleProfileClick
    },
    {
      label: "Sign out",
      color: "red",
      icon: ArrowRightOnRectangleIcon,
      handle: handleSignOutClick
    },
  ];
 
  return (
    <Navbar className="sticky top-0 z-50 max-w-full p-2 lg:px-10" fullWidth>
      <div className="relative flex justify-between items-center text-blue-gray-900">
        <Link href="/">
          <div className="flex items-center gap-2">
            <PaperAirplaneIcon strokeWidth={2} className="w-5 h-5"/>
            <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-bold" color="blue-gray">
              WordRacer
            </Typography>
          </div>
        </Link>
        <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
          <NavList items={navListItems}/>
        </div>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
        { status !== "loading" && (
          session?.user ? 
          <ProfileMenu items={userMenu} user={session.user}/> 
            : 
          <ProfileMenu items={guestMenu} user={{name: "Guest", picture: null}}/>
        )}
      </div>

      <Collapse open={isNavOpen} className="overflow-scroll">
        <NavList items={navListItems} />
      </Collapse>
    </Navbar>
  );
}

export default CustomNavbar;