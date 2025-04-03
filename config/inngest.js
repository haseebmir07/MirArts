// import { Inngest } from "inngest";
// import connectDB from "./db";
// import User from "@/models/user";

// // Create a client to send and receive events
// export const inngest = new Inngest({ id: "MirArts" });

// //inngest function to save user data to a database
// export const syncUserCreation = inngest.createFunction(
//     {
//         id:'sync-user-from-clerk'
//     },
//     {
//         event:'clerk/user.created'
//     },
//     async({event})=>{
// const{id , first_name, last_name, email_addresses, image_url}=event.data
// const userData={
//     _id:id,
//     email:email_addresses[0].email_address,
//     name:first_name + ' ' + last_name,
//     imageUrl: image_url || "https://www.gravatar.com/avatar?d=mp" 
// };
// await connectDB()
// await User.create(userData)
//     }
// )
// //inngest functioon to update user data in db
// export const syncUserUpdation=inngest.createFunction(
//     {
//         id:'update-user-from-clerk'
//     },
//     {
//         event:'clerk/user.updated'},
//         async({event})=>{
//             const{id , first_name, last_name, email_addresses, image_url}=event.data
// const userData={
//     _id:id,
//     email:email_addresses[0].email_address,
//     name:first_name + ' ' + last_name,
//     imageUrl: image_url || "https://www.gravatar.com/avatar?d=mp", 

//         }
//         await connectDB()
//         await User.findByIdAndUpdate(id,userData)
//     }
// )
// //ingest function to delete user from database 
// export const syncUserDeletion= inngest.createFunction(
//     {
//         id:'delete-user-clerk'
//     }, 
//    { event:'clerk/user.deleted'},
//    async({event})=>{
// const{id}=event.data
// await connectDB()
// await User.findByIdAndDelete(id)
// }
// )
// // import { Inngest } from "inngest";
// // import connectDB from "@/config/db";  // ✅ Corrected path
// // import User from "@/models/User";  // ✅ Fixed case issue

// // // Create a client to send and receive events
// // export const inngest = new Inngest({ id: "MirArts" });

// // // Inngest function to save user data to a database
// // export const syncUserCreation = inngest.createFunction(
// //   { id: "sync-user-from-clerk" },
// //   { event: "clerk/user.created" },
// //   async ({ event }) => {
// //     if (!event.data) return;

// //     const { id, first_name, last_name, email_addresses, image_url } = event.data;

// //     const userData = {
// //       clerkId: id,  // ✅ Use clerkId instead of _id
// //       email: email_addresses?.[0]?.email_address || "",
// //       name: [first_name, last_name].filter(Boolean).join(" "),  // ✅ Prevents "null null"
// //       image_url: image_url || "",
// //     };

// //     await connectDB();
// //     await User.create(userData);
// //   }
// // );

// // // Inngest function to update user data in DB
// // export const syncUserUpdation = inngest.createFunction(
// //   { id: "update-user-from-clerk" },  // ✅ Fixed typo in function ID
// //   { event: "clerk/user.updated" },
// //   async ({ event }) => {
// //     if (!event.data) return;

// //     const { id, first_name, last_name, email_addresses, image_url } = event.data;

// //     const userData = {
// //       clerkId: id,
// //       email: email_addresses?.[0]?.email_address || "",
// //       name: [first_name, last_name].filter(Boolean).join(" "),  // ✅ Prevents "null null"
// //       image_url: image_url || "",
// //     };

// //     await connectDB();
// //     await User.findOneAndUpdate({ clerkId: id }, userData, { new: true, upsert: true });
// //   }
// // );

// // // Inngest function to delete user from database
// // export const syncUserDeletion = inngest.createFunction(
// //   { id: "delete-user-clerk" },
// //   { event: "clerk/user.deleted" },
// //   async ({ event }) => {
// //     if (!event.data) return;

// //     const { id } = event.data;

// //     await connectDB();
// //     await User.findOneAndDelete({ clerkId: id });
// //   }
// // );
import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "MirArts" });

// Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-from-clerk'
    },
    {
        event: 'clerk/user.created'
    },
    async ({ event }) => {
        console.log("🟢 Received event:", event); // Debugging log

        const { id, first_name, last_name, email_addresses, image_url, profile_image_url} = event.data;

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name || ''} ${last_name || ''}`.trim(), // Avoid "null null"
            imageUrl: image_url || profile_image_url || "https://www.gravatar.com/avatar?d=mp"
// Correct field name
        };

        await connectDB();

        try {
            await User.create(userData);
            console.log("✅ User created:", userData);
        } catch (error) {
            console.error("❌ Error creating user:", error);
        }
    }
);

// Inngest function to update user data in DB
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.updated'
    },
    async ({ event }) => {
        console.log("🟢 User update event received:", event); // Debugging log

        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name || ''} ${last_name || ''}`.trim(),
            imageUrl: image_url || "https://www.gravatar.com/avatar?d=mp"
        };

        await connectDB();

        try {
            await User.findByIdAndUpdate(id, userData);
            console.log("✅ User updated:", userData);
        } catch (error) {
            console.error("❌ Error updating user:", error);
        }
    }
);

// Inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-clerk'
    },
    {
        event: 'clerk/user.deleted'
    },
    async ({ event }) => {
        console.log("🟢 User delete event received:", event);

        const { id } = event.data;
        await connectDB();

        try {
            await User.findByIdAndDelete(id);
            console.log("✅ User deleted:", id);
        } catch (error) {
            console.error("❌ Error deleting user:", error);
        }
    }
);
