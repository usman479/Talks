'use server'

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectedToDB } from "../mongoose"

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createThread({ text, author, communityId, path }: Params) {

    try {
        connectedToDB();

        const createdThread = await Thread.create({
            text,
            author,
            // TODO
            community: null,
        });

        // Update user model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating Thread ${error.message}`)
    }

}

export async function fetchPosts({ pageNumber = 1, pageSize = 20 }) {
    connectedToDB();

    // Calculate the number of posts to skip

    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetc the posts that have no parents (top-level threads...)
    const postsQuery = Thread.find({
        parentId: { $in: [null, undefined] }
    })
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id name parentId image"
            }
        });

    const totalPostsCount = await Thread.countDocuments({
        parentId: { $in: [null, undefined] }
    })

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };

}

export async function fetchThreadById(id: string) {
    connectedToDB();
    try {
        // TODO: Populate Community
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id image name"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }, {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec();

        return thread;
    } catch (error: any) {
        throw new Error(`Error fetching the thread: ${error.message}`)
    }
}