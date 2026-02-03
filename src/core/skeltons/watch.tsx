
const WatchSkeleton = () => {
  return (
    <div className='md:mx-3 animate-pulse'>
      <div className="grid md:grid-cols-3 gap-5">
        {/* Main Video Section */}
        <main className='md:col-span-2'>
          {/* Video Player Skeleton */}
          <div className="w-full aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg" />

          {/* Video Title Skeleton */}
          <div className="mt-3 h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />

          {/* Channel Info and Actions */}
          <div className="flex gap-6 md:justify-between mx-3 mt-5">
            {/* Channel Info */}
            <div className="flex items-center space-x-2">
              <div className="rounded-full w-10 h-10 bg-gray-300 dark:bg-gray-700" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center gap-2'>
              <div className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-full h-9 w-24" />
              
              <div className="flex items-center gap-2 md:space-x-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Comment Input Skeleton */}
          <div className="flex gap-1 mt-4">
            <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>

          {/* Comments Skeleton */}
          <div className="mt-4 space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border p-4 rounded shadow">
                {/* Username */}
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
                
                {/* Comment Content */}
                <div className="space-y-2 mb-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
                </div>

                {/* Comment Actions */}
                <div className="flex space-x-4 mt-2">
                  <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Sidebar Video List Skeleton */}
        <div className="flex flex-col gap-2 w-full mx-1 md:mx-0 md:mt-2">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="flex w-full rounded-lg overflow-hidden h-36"
            >
              {/* Thumbnail */}
              <div className="w-48 h-32 bg-gray-300 dark:bg-gray-700 rounded-lg" />
              
              {/* Video Info */}
              <div className="p-4 flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/5" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24" />
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchSkeleton;