// A simple Skeleton component for better UX during loading
const VideoSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 aspect-video rounded-xl mb-3"></div>
    <div className="flex space-x-3">
      <div className="rounded-full bg-gray-300 h-10 w-10"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export default VideoSkeleton;