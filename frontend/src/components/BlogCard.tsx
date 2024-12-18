import { Link } from "react-router-dom";

interface BlogCardProps {
    id: string;
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
  }
  
  export const BlogCard = ({ 
    id,
    authorName, 
    title, 
    content,
    publishedDate }: BlogCardProps) => {
    return <Link to={`/blog/${id}`}>
        <div className=" p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
            <div className="flex">
                <div className="flex justify-center flex-col">
                    <Avatar name={authorName} size={"small"} />
                </div>
                <div className="font-medium pl-2"> {authorName}</div>
                <div className="flex justify-center flex-col pl-2">
                    <Circle />
                </div>
                <div className="pl-2 font-thin text-slate-500">
                    {publishedDate}
                </div>
            </div>

            <div className="mt-3 text-2xl font-semibold leading-tight">
                {title}
            </div>

            <div className="text-muted-foreground font-thin">
                {content.slice(0, 100) + "..."}
            </div>

            <div className="font-thin text-slate-400 pt-2" >
                {`${Math.ceil(content.length / 100)} min read`} 
            </div>

        </div>
    </Link>
  };

  export function Circle(){
    return <div className="h-1 w-1 rounded-full bg-slate-200">
    </div>
  }

  export function Avatar({ name, size = "small" }: { name: string, size: "small" | "big" }) {
    return (
      <div
        className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${
          size === "small" ? "w-6 h-6" : "w-10 h-10"
        }`}
      >
        <span
          className={`${
            size === "small" ? "text-xs" : "text-2xl"
          } pb-1 font-extralight text-gray-600 dark:text-gray-300`}
        >
          {name[0]}
        </span>
      </div>
    );
  }