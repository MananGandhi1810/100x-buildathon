// import Pusher from "pusher";

// const pusher = new Pusher({
//     appId: process.env.PUSHER_APP_ID,
//     key: process.env.PUSHER_KEY,
//     secret: process.env.PUSHER_SECRET,
//     cluster: "ap2",
//     useTLS: true,
// });

const sendMessage = (channel, event, message) => {
    // pusher.trigger(channel, event, {
    //     message: message,
    // });
    console.log(`${channel}: ${event} - ${message}`);
};

export { sendMessage };
