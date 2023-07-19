const StatsSkeleton = () => {
  return (
    <div className="flex items-center flex-row">
      <div className="relative">
        <div className="bg-gray-200 rounded-full h-16 w-16"/>
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="bg-gray-200 rounded-full h-4 w-[75%] mb-3"/>
        <div className="bg-gray-200 rounded-full h-3 w-[75%]"/>
      </div>
    </div>
  )
}

export default StatsSkeleton