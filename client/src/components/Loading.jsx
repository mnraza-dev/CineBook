import React from "react";
const Loading = () => {
  return (
    <div className="h-[80vh] flex items-center justify-center ">
      <div className="animate-spin rounded-full h-14 w-14 border-2 border-t-amber-200"></div>
    </div>
  );
};

export default Loading;
