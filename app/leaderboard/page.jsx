"use client"
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Typography } from '@material-tailwind/react';
import { timeAgo } from '@utils/tools';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link';

const Leaderboard = () => {
  const searchParams = useSearchParams();
  const LIMIT_USER = 5;
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [maxPage, setMaxPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await fetch(`/api/users?page=${page}&limit=${LIMIT_USER}`);
      const data = await response.json();
      if(response.ok) {
        setUsers(data.users);
        setMaxPage(data.pageCount);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [page]);

  const handlePrev = () => {
    setPage(page > 1 ? page - 1 : page);
  }

  const handleNext = () => {
    setPage(page < maxPage ? page + 1 : page);
  }

  const TABLE_HEAD = ["Rank", "Name", "Taken", "Highest WPM"];

  return (
    <section className="w-full relative lg:px-24 px-10 py-6">
      <div className="mx-auto rounded-xl shadow-sm border-2 border-blue-gray-50 max-w-7xl">
        <Card className="w-full h-full">
          <CardHeader floated={false} shadow={false} className="rounded-none mb-2">
            <div className="ml-2">
              <Typography variant="h2" color="blue-gray" className="font-extrabold tracking-tight leading-none">
                Leaderboard
              </Typography>
              <Typography variant="paragraph" color="gray" className="mt-1 font-light">
                Compete against other users and aim for the top spot on the leaderboard.
              </Typography>
            </div>
          </CardHeader>
          { loading ? 
            <CardBody className="flex flex-col gap-4 animate-pulse" role="status">
              {[...Array(6)].map((_, index) => <div key={index} className="w-full h-12 bg-gray-300 rounded-xl"/>)}
              <div className="w-full flex justify-between py-2">
                <div className="lg:w-24 w-16 max-w-full h-8 bg-gray-300 rounded-xl"/>
                <div className="flex gap-4">
                  <div className="lg:w-24 w-16 max-w-full h-8 bg-gray-300 rounded-xl"/>
                  <div className="lg:w-24 w-16 max-w-full h-8 bg-gray-300 rounded-xl"/>
                </div>
              </div>
            </CardBody>
            :
            <>
              <CardBody className="p-0 overflow-x-auto">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                  <thead>
                    <tr className="text-blue-600">
                      { TABLE_HEAD.map((head, index) => {
                        const pos = (index === 0 || index === TABLE_HEAD.length - 1) ? "text-center" : ""
                        return (
                          <th
                            key={head}
                            className={`border-blue-100 bg-blue-50/50 px-3 py-4`}
                          >
                            <Typography
                              variant="small"
                              className={`font-bold leading-none opacity-70 tracking-wider ${pos}`}
                            >
                              {head}
                            </Typography>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    { users.map(({id, name, picture, highestWPM}, index) => {
                      const { wpm, taken } = highestWPM;
                      const isLast = index === users.length - 1;
                      const classes = isLast ? "px-3 py-4" : "px-3 py-4 border-b border-blue-gray-50";
                      const this_rank = (page - 1) * LIMIT_USER + index + 1;

                      const rankColor = (rank) => {
                        if(rank === 1) {
                          return "bg-amber-100 text-amber-600"
                        } else if(rank === 2) {
                          return "bg-blue-gray-100 text-blue-gray-500"
                        } else if(rank === 3) {
                          return "bg-brown-100 text-brown-500"
                        }
                        return "bg-gray-200 text-gray-600"
                      }
                      const profileBorderColor = (rank) => {
                        if(rank === 1) {
                          return "amber"
                        } else if(rank === 2) {
                          return "blue-gray"
                        } else if(rank === 3) {
                          return "brown"
                        }
                        return "white";
                      }
                      return (
                        <tr key={index} className="whitespace-nowrap">
                          <td className={classes}>
                            <div className="flex justify-center items-center">
                              <Typography as="span" variant="small" color="gray" className={`w-8 h-8 inline-flex justify-center items-center rounded-full  font-bold text-lg text-center ${rankColor(this_rank)}`}>
                                {this_rank}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="flex items-center gap-4">
                              <Avatar src={picture?.url ? picture.url : "/assets/default.png"} withBorder={true} color={profileBorderColor(this_rank)} alt={name} size="sm" className="p-0.5"/>
                              <Link href={`/profile/${id}`} className="cursor-pointer pointer-events-auto">
                                <Typography variant="small" className="font-bold text-gray-500 hover:text-gray-600 hover:underline underline-offset-2">
                                  { name }
                                </Typography>
                              </Link>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography variant="small" className="font-bold text-gray-500">
                              { timeAgo(taken) }
                            </Typography>
                          </td>
                          <td className={`flex justify-center ${classes}`}>
                            <Typography variant="small" color="gray" className={`font-bold text-center w-1/4 rounded-lg py-2 ${rankColor(this_rank)}`}>
                              { wpm }
                            </Typography>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </CardBody>
              <CardFooter className="mt-auto flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  Page {page} of {maxPage}
                </Typography>
                <div className="flex gap-2">
                  <Link href={page - 1 < 1 ? '#' : {pathname: '/leaderboard', query: {page: page - 1}}} className={(page - 1 < 1) ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'}>
                    <Button variant="outlined" color="blue-gray" size="sm" onClick={handlePrev} disabled={page - 1 < 1}>
                      Previous
                    </Button>
                  </Link>
                  <Link href={page + 1 > maxPage ? '#' : {pathname: '/leaderboard', query: {page: page + 1}}} className={(page + 1 > maxPage) ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'}>
                    <Button variant="outlined" color="blue-gray" size="sm" onClick={handleNext} disabled={page + 1 > maxPage}>
                      Next
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </>
          }
        </Card>
      </div>
    </section>
  );
}

export default Leaderboard