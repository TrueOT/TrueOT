interface SummaryHeaderProps {
  username: string;
}

export function SummaryHeader({ username }: SummaryHeaderProps) {
  return (
    <div>
      <h2 className="text-base font-medium mb-2">Welcome back,</h2>
      <h1 className="text-2xl font-bold mb-6">{username}</h1>
      
      <p className="text-sm text-gray-700">
        System status is ready. It is time to manage vulnerabilities.
      </p>
      
      <div className="flex mt-8">
        <button className="text-sm text-gray-500 flex items-center gap-1">
          Tap to start →
        </button>
      </div>
    </div>
  );
} 