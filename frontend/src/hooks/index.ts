import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog{
    "content" : string;
    "title" : string;
    "id" : string;
    "author": {
        "name": string;
    }
}


export const useBlog =({ id } : { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();
  
    useEffect(() => {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        console.error("No token found");
        setLoading(false); // Stop loading if no token is found
        return;
      }
  
      axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include 'Bearer' before the token
        }
      })
      .then(response => {
        console.log(response.data);
        setBlog(response.data.blog);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching blogs:", error);
        setLoading(false); // Stop loading on error
      });
    }, [id]);
  
    return {
      loading,
      blog,
    };
}




export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
  
    useEffect(() => {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        console.error("No token found");
        setLoading(false); // Stop loading if no token is found
        return;
      }
  
      axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include 'Bearer' before the token
        }
      })
      .then(response => {
        setBlogs(response.data.blogs);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching blogs:", error);
        setLoading(false); // Stop loading on error
      });
    }, []);
  
    return {
      loading,
      blogs,
    };
  };
  