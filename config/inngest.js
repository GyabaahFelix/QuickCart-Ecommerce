import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to save user data to the database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-creation'
        
    },
    { event: 'clerk/user.created'},
    async (event) => {
        const { id, first_name, last_name, email_address, image_url } = event.data;
        const userData = {
            _id: id,
            email: email_address[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.create(userData)
    }
)

// Inngest Function to update user data in the database
export const syncUserUpdate = inngest.createFunction(
    {
        id: 'sync-user-from-update'
        
    },
    { event: 'clerk/user.updated'},
    async (event) => {
        const { id, first_name, last_name, email_address, image_url } = event.data;
        const userData = {
            email: email_address[0].email_address,
            name: first_name + ' ' + last_name,
            imageUrl: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)

// Inngest Function to delete user data from the database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'sync-user-from-deletion'
        
    },
    { event: 'clerk/user.deleted'},
    async (event) => {
        const { id } = event.data;
        await connectDB()
        await User.findByIdAndDelete(id)
    }
)