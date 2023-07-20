"use client"
import { useState } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Spinner
} from "@material-tailwind/react";
import {
  FaceFrownIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";
import { timeAgo } from "@utils/tools";
import Link from "next/link"

const UserRecord = ({ loading, records, title, titleVariant, requiredAuth, authStatus }) => {
  const TABLE_HEAD = ["Taken", "WPM", "Accuracy"];
  const MAX_ROW = 6;
  const MAX_PAGE = Math.ceil(records.length / MAX_ROW) || 1;
  const [page, setPage] = useState(1);
  const paginate = (this_array) => {
    return this_array.slice((page - 1) * MAX_ROW, page * MAX_ROW);
  }

  const handlePrev = () => {
    setPage(page > 1 ? page - 1 : page);
  }

  const handleNext = () => {
    setPage(page < MAX_PAGE ? page + 1 : page);
  }

  const RenderRecords = () => {
    return records.length > 0 ?
      paginate(records).map(({ wpm, accuracy, createdOn }, index) => {
        const isLast = index === records.length - 1;
        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
        return (
          <tr key={index}>
            <td className={classes}>
              <Typography variant="small" color="gray" className="font-bold">
                { timeAgo(createdOn) }
              </Typography>
            </td>
            <td className={`flex justify-center ${classes}`}>
              <Typography variant="small" className="font-bold text-center w-1/2 rounded-lg py-2 bg-blue-100/50 text-blue-500">
                { wpm }
              </Typography>
            </td>
            <td className={classes}>
              <Typography variant="small" className="font-bold text-indigo-500 text-center">
                { accuracy }{"%"}
              </Typography>
            </td>
          </tr>
        );
      })
      :
      <tr>
        <td colSpan="12" className="py-24">
          <div className="flex justify-center items-center flex-col gap-2">
            <FaceFrownIcon strokeWidth={2} className="w-6 h-6"/>
            <Typography variant="small" color="gray">
              No test taken, yet
            </Typography>
          </div>
        </td>
      </tr>
  }

  return (
    <Card className="h-full w-full shadow-none">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant={titleVariant} color="blue-gray" className="mt-2 mb-1 font-bold leading-none">
          { title }
        </Typography>
      </CardHeader>
      <CardBody className="p-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => {
                const pos = (index > 0) ? "text-center" : ""
                return(
                  <th 
                    key={head} 
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-normal leading-none opacity-70 ${pos}`}
                    >
                      {head}
                    </Typography>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            { requiredAuth && authStatus === "unauthenticated" ?
              <tr>
                <td colSpan="12" className="py-24">
                  <div className="flex justify-center items-center flex-col gap-2">
                    <RocketLaunchIcon strokeWidth={2} className="w-6 h-6"/>
                    <Typography variant="small" color="gray">
                      <Link href="/auth/signin" className="underline text-green-300">Sign in</Link> to save your taken test
                    </Typography>
                  </div>
                </td>
              </tr>
              : (
                loading ?
                <tr>
                  <td colSpan="12" className="py-24">
                    <div className="flex justify-center">
                      <Spinner color="blue" className="h-6 w-6 text-blue-500/10" />
                    </div>
                  </td>
                </tr>
                :
                <RenderRecords/>
              )
            }
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="mt-auto flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {page} of { MAX_PAGE }
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" color="blue-gray" size="sm" onClick={handlePrev} disabled={page - 1 < 1}>
            Previous
          </Button>
          <Button variant="outlined" color="blue-gray" size="sm" onClick={handleNext} disabled={page + 1 > MAX_PAGE}>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default UserRecord;