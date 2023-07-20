import { 
  Avatar,
  IconButton,
  Tooltip,
  Typography,
  Card,
  CardHeader,
  CardBody
} from "@material-tailwind/react";

import {
  PencilSquareIcon,
  IdentificationIcon
} from "@heroicons/react/24/solid";
import UserRecord from '@components/UserRecord';

const ProfileMain = ({ loadingProfile, loadingRecord, user, session, openEdit, stats, records }) => {
  const { id, name, email, picture } = user;
  return (
    <>
      <div className="rounded-xl bg-white shadow-sm border-2 border-blue-gray-50 max-w-5xl w-full mx-auto">
        <div className="relative flex flex-wrap items-center pt-4 pb-5">
          <div className='ms-5 w-full'>
            <div className="-mt-16 w-40">
              <div className="w-40 h-40">
                { loadingProfile ?
                  <div className="h-40 w-full rounded-full border border-3 border-gray-300 bg-gray-200"/>
                  :
                  <Avatar
                    src={picture?.url ? picture?.url : "/assets/default.png"}
                    alt="Profile picture"
                    variant="circular"
                    className="h-full w-full bg-blue-gray-50 border border-blue-gray-100"
                  />
                }
              </div>
            </div>
            {(!loadingProfile && session?.user && session?.user.id === id) &&
              <Tooltip content="Edit Profile">
                <IconButton
                  size="sm"
                  variant="text"
                  color="blue"
                  className="!absolute top-4 right-4 text-blue-gray-300 hover:text-blue-500"
                  onClick={openEdit}
                >
                  <PencilSquareIcon className="h-7 w-7" />
                </IconButton>
              </Tooltip>        
            }
            <div className="w-full mt-2">
              { loadingProfile ? 
                <div className="w-[75%] h-5 mt-3 bg-gray-300 rounded-lg animate-pulse"/>
                :
                <Typography variant="h3" className="tracking-wide" color="blue-gray">
                  {name}
                </Typography>
              }
            </div>
            <div className="w-full mb-2">
              { loadingProfile ?
                <div className="w-[75%] h-5 mt-3 bg-gray-300 rounded-lg animate-pulse"/>
                :
                <Typography variant="lead" className="font-light" color="gray">
                  {email}
                </Typography>
              }
            </div>
            <div className="w-full">
              { loadingProfile ?
                <div className="w-[25%] h-4 mt-3 bg-gray-300 rounded-lg animate-pulse"/>
                :
                <Typography variant="small" className="font-light flex items-center gap-2" color="gray">
                  <IdentificationIcon strokeWidth={2} className="w-5 h-5"/>
                  Account ID: {id}
                </Typography>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-white shadow-sm border-2 border-blue-gray-50 max-w-5xl w-full mx-auto">
        <Card className="w-full h-full py-2">
          <CardHeader floated={false} shadow={false} className="rounded-none mx-4 mb-2">
            <Typography variant="h3" color="blue-gray" className="font-bold leading-none">
              Statistics
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <div className="grid grid-rows-2 grid-cols-3 gap-6">
              { loadingRecord ?
                [...Array(6)].map((_, index) => <div key={index} className="w-full h-32 rounded-lg bg-gray-300 animate-pulse"/>)
                :
                stats.map(({title, color, value}, index) => {
                  return (
                    <div key={index} className={`w-full ${color} rounded-lg text-center py-8 px-2`}>
                      <Typography variant="h4" className="font-extrabold">
                        { value }
                      </Typography>
                      <Typography className="text-md font-light">
                        { title }
                      </Typography>
                    </div>
                  )
                })
              }
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="rounded-xl flex justify-center bg-white shadow-sm border-2 border-blue-gray-50 max-w-5xl w-full h-full mx-auto">
        <UserRecord loading={loadingRecord} records={records} title="Latest Records" titleVariant="h3" requireAuth={false}/>
      </div>
    </>
  )
}

export default ProfileMain;