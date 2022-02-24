const c = new Date().toLocaleString()
const Guest = {
    created: "N/A",
    name: "Guest",
    profile_pic_url: null,
    streak_emoji:  "\u{1F525}",
    sent: 0,
    received: 0,
    added_me: {},
    pending: {},
    friends: {
        "Guest@Guest.com": {
            created: c,
            profile_pic_url: null,
            name: "Guest",
            status: "new-friend",
            streak: 0,
            sent: 0,
            received: 0,
            last_time_stamp: null,
            snaps: []
        }
    },
}
export default Guest;