import { FullBlog } from "../components/FullBlog";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Appbar } from "../components/Appbar";

export const Blog = () => {
    const { id } = useParams();
    const { loading, blog } = useBlog({
      id: id || "",
    });
  
    if (loading) {
      return <div>
              <Appbar />
                  <div className="flex justify-center">
                      <div>
                          <BlogSkeleton />
                          <BlogSkeleton />
                          <BlogSkeleton />
                          <BlogSkeleton />
                          <BlogSkeleton />
                      </div>;
                  </div>
              </div>
    }
  
    console.log(blog);  // Add this to inspect the blog object
  
    if (!blog) {
      return <div>Blog not found</div>;
    }
  
    return <div>
      <FullBlog blog={blog} />
    </div>;
  };
  