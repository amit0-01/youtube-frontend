
export const TweetsSkeleton = () => {
  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {/* Skeleton for tweet input */}
      <div className="bg-white p-5 rounded-2xl shadow-md mb-6 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <div className="w-20 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Skeleton for tweets */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-gray-300"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="flex justify-between mt-5">
            <div className="flex gap-6">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

