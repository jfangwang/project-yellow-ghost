import GuestPic from '../assets/images/guest-profile-pic.png';
import RickPic from '../assets/images/rick-profile-pic.jpg';
import MortyPic from '../assets/images/morty-profile-pic.jpg';

const c = new Date().toLocaleString()

export const Guest = {
    created: "N/A",
    name: "Guest",
    email: "Guest@Guest.com",
    username: "Guest123",
    profile_pic_url: GuestPic,
    streak_emoji:  "\u{1F525}",
    phoneNumber: null,
    sent: 1,
    received: 2,
    added_me: {},
    pending: {},
    friends: {
        "Guest@Guest.com": {
            created: c,
            profile_pic_url: GuestPic,
            name: "Guest",
            status: "new-friend",
            streak: 0,
            sent: 0,
            received: 0,
            last_time_stamp: null,
            snaps: []
        },
    },
}
export const Strangers = {
    "Rick@Guest.com": {
        created: "N/A",
        profile_pic_url: RickPic,
        name: "Rick",
        status: "new-friend",
        streak: 0,
        streak_ref: null,
        sent: 0,
        received: 0,
        last_time_stamp: null,
        snaps: []
      },
      "Morty@Guest.com": {
        created: "N/A",
        profile_pic_url: MortyPic,
        name: "Morty",
        status: "new-friend",
        streak: 0,
        streak_ref: null,
        sent: 0,
        received: 0,
        last_time_stamp: null,
        snaps: []
      },
}
export const Everyone = {
    "Guest@Guest.com": {
        created: "N/A",
        profile_pic_url: GuestPic,
        name: "Guest",
        status: "new-friend",
        streak: 0,
        streak_ref: null,
        sent: 0,
        received: 0,
        last_time_stamp: null,
        snaps: []
    },
    "Rick@Guest.com": {
      created: "N/A",
      profile_pic_url: RickPic,
      name: "Rick",
      status: "new-friend",
      streak: 0,
      streak_ref: null,
      sent: 0,
      received: 0,
      last_time_stamp: null,
      snaps: []
    },
    "Morty@Guest.com": {
      created: "N/A",
      profile_pic_url: MortyPic,
      name: "Morty",
      status: "new-friend",
      streak: 0,
      streak_ref: null,
      sent: 0,
      received: 0,
      last_time_stamp: null,
      snaps: []
    }
}