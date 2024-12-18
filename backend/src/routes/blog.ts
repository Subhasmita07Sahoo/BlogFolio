import {Hono} from "hono"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from "subhasahoocommon"

export const blogRouter = new Hono<{
    Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	},
	Variables : {
		userId: string
	}
}>();


//middleware
blogRouter.use('/*', async (c, next) => {
    const jwt = c.req.header('Authorization') || "";
    const token = jwt.split(' ')[1];

    try {
        const payload = await verify(token, c.env.JWT_SECRET);
        if (payload && typeof payload.id === 'string') {
            c.set('userId', payload.id); // Explicitly ensure payload.id is a string
            await next();
        } else {
            c.status(401);
            return c.json({ error: "unauthorized user" });
        }
    } catch (e) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
});



//blog creation route
blogRouter.post('/', async(c) => {
    const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body) ;
    if (!success) {
        c.status(400)
        return c.json({ message: 'Invalid inputs' });
    }

	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: userId
		}
	});
	return c.json({
		id: post.id
	});
})


//blog update route
blogRouter.put('/', async(c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body) ;
    if (!success) {
        c.status(400)
        return c.json({ message: 'Invalid inputs' });
    }
    
	const post = await prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

    return c.json({
		id: post.id
	});
})

//all blogs that exist
blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const blogs = await prisma.post.findMany({
		select: {
			title: true,
			content: true,
			id: true,
			author: {
				select: {
					name: true
					}
			}
		}
	});
	return c.json({blogs});
})

//get the blog of user using id
blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");  // This gets the id from the URL, not the request body
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: id,
            },
            select: {
                title: true,
                content: true,
                id: true,
                author: {
                    select: {
                        name: true,
                    }
                }
            }
        });

        if (!blog) {
            c.status(404)
			return c.json({ error: "Blog not found" });
        }

        return c.json({ blog });
    } catch (e) {
        console.error("Error fetching blog:", e);
        c.status(500)
		return  c.json({ error: "Server error" });
    }
});


