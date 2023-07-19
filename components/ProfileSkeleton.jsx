import StatsSkeleton from "./StatsSkeleton"

const ProfileSkeleton = () => {
  return (
    <section className="mx-12 my-24 flex justify-center relative" role='status'>
      <div className="flex flex-col w-full max-w-5xl rounded-3xl bg-white border border-3 border-gray-300 shadow">
        <div className="relative flex flex-wrap items-center p-4">

          <div className='ms-5 w-full'>
            <div className="relative -mt-20 w-40">
                <div className="w-40 h-40">
                  <div className="h-full w-full rounded-full shadow border border-3 border-gray-300 bg-gray-200"></div>
                </div>
              </div>
          </div>

          <div className="w-[75%] h-5 mt-5 bg-gray-200 rounded-full"/>
          <div className="w-[75%] h-4 mt-4 bg-gray-200 rounded-full"/>
          
          <div className="w-full relative flex my-10 items-center animate-none">
            <div className="flex-grow border-t border-2 border-gray-300 shadow-sm"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-xl">Statistics</span>
            <div className="flex-grow border-t border-2 border-gray-300 shadow-sm"></div>
          </div>

          <div className="w-full grid grid-rows-2 grid-cols-2 gap-8">
            <StatsSkeleton/>
            <StatsSkeleton/>
            <StatsSkeleton/>
            <StatsSkeleton/>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ProfileSkeleton