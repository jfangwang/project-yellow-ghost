import GuestPic from '../images/guest-profile-pic.png';
import RickPic from '../images/rick-profile-pic.jpg';
import MortyPic from '../images/morty-profile-pic.jpg';
import mem1 from '../images/memories/rickAndMortyMem1.jpg';
import mem2 from '../images/memories/rickAndMortyMem2.jpg';
import mem3 from '../images/memories/rickAndMortyMem3.jpg';
import mem4 from '../images/memories/rickAndMortyMem4.jpg';
import mem5 from '../images/memories/rickAndMortyMem5.jpg';
import mem6 from '../images/memories/rickAndMortyMem6.jpg';
import mem7 from '../images/memories/rickAndMortyMem7.png';
import mem8 from '../images/memories/rickAndMortyMem8.jpg';
import mem9 from '../images/memories/rickAndMortyMem9.png';
import mem10 from '../images/memories/rickAndMortyMem10.jpg';
import mem11 from '../images/memories/rickAndMortyMem11.jpg';
import mem12 from '../images/memories/rickAndMortyMem12.jpg';
import mem13 from '../images/memories/rickAndMortyMem13.png';
import mem14 from '../images/memories/rickAndMortyMem14.jpg';
import mem15 from '../images/memories/rickAndMortyMem15.jpg';
import {v4 as uuidv4} from 'uuid';

const newDate = new Date().toLocaleString();
const guestID = uuidv4();
const rickID = uuidv4();
const mortyID = uuidv4();

export const Guest = {
  addedMe: {
    [mortyID]: {
      created: newDate,
      email: 'Morty@Guest.com',
      firstName: 'Morty',
      id: mortyID,
      lastName: 'Smith',
      lastTimeStamp: null,
      phoneNumber: null,
      profilePicUrl: MortyPic,
      username: 'aw-jeez123',
    },
  },
  brokeup: {},
  created: newDate,
  deleteSnaps: {},
  email: 'jonnyAppleseed@Guest.com',
  faceIDURL: null,
  firstName: 'Jonny',
  friends: {
    [guestID]: {
      created: newDate,
      email: 'jonnyAppleseed@Guest.com',
      firstName: 'Jonny',
      id: guestID,
      lastName: 'Appleseed',
      phoneNumber: null,
      profilePicUrl: GuestPic,
      username: 'jonny_appleseed123',
      friendship: newDate,
      lastTimeStamp: null,
      messages: {},
      newSnaps: {},
      nickname: null,
      openedByMe: {
        lastTimeStamp: null,
        opened: 0,
      },
      openedByFriend: {
        lastTimeStamp: null,
        opened: 0,
      },
      readSnaps: [],
      received: {
        lastTimeStamp: null,
        receivedSnaps: 0,
      },
      sent: {
        lastTimeStamp: null,
        sentSnaps: 0,
      },
      status: 'new-friend',
      streak: 0,
      streakRef: null,
    },
  },
  id: guestID,
  lastName: 'Appleseed',
  loggedOffTimeStamp: null,
  memories: {
    ['4/7/2022, 3:08:22 PM']: {
      date: '4/7/2022, 3:08:22 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem1,
    },
    ['4/7/2022, 3:10:44 PM']: {
      date: '4/7/2022, 3:10:44 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem2,
    },
    ['4/7/2022, 3:11:17 PM']: {
      date: '4/7/2022, 3:11:17 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem3,
    },
    ['4/7/2022, 3:13:12 PM']: {
      date: '4/7/2022, 3:13:12 PM',
      type: 'image',
      url: mem4,
    },
    ['4/7/2022, 3:13:20 PM']: {
      date: '4/7/2022, 3:13:20 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem5,
    },
    ['4/7/2022, 3:13:50 PM']: {
      date: '4/7/2022, 3:13:50 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem6,
    },
    ['4/7/2022, 3:14:40 PM']: {
      date: '4/7/2022, 3:14:40 PM',
      type: 'image',
      url: mem7,
    },
    ['4/7/2022, 3:14:57 PM']: {
      date: '4/7/2022, 3:14:57 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem8,
    },
    ['4/7/2022, 3:15:11 PM']: {
      date: '4/7/2022, 3:15:11 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem9,
    },
    ['4/7/2022, 3:15:37 PM']: {
      date: '4/7/2022, 3:15:37 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem10,
    },
    ['4/7/2022, 3:15:37 PM']: {
      date: '4/7/2022, 3:15:37 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem11,
    },
    ['4/7/2022, 3:15:38 PM']: {
      date: '4/7/2022, 3:15:38 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem12,
    },
    ['4/7/2022, 3:15:40 PM']: {
      date: '4/7/2022, 3:15:40 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem13,
    },
    ['4/7/2022, 3:16:37 PM']: {
      date: '4/7/2022, 3:16:37 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem14,
    },
    ['4/7/2022, 3:17:37 PM']: {
      date: '4/7/2022, 3:17:37 PM',
      orientation: 'portrait',
      type: 'image',
      url: mem15,
    },
  },
  pending: {},
  phoneNumber: null,
  profilePicUrl: GuestPic,
  received: 0,
  story: {},
  sent: 0,
  snapTime: -1,
  streakEmoji: '\u{1F525}',
  username: 'jonny_appleseed123',
};

export const Morty = {
  addedMe: {},
  brokeup: {},
  created: newDate,
  deleteSnaps: {},
  email: 'Morty@Guest.com',
  faceIDURL: null,
  firstName: 'Morty',
  friends: {
    [guestID]: {
      created: Guest['created'],
      email: Guest['email'],
      firstName: Guest['firstName'],
      id: Guest['id'],
      lastName: Guest['lastName'],
      lastTimeStamp: Guest['lastTimeStamp'],
      phoneNumber: Guest['phoneNumber'],
      profilePicUrl: Guest['profilePicUrl'],
      username: Guest['username'],
    },
  },
  id: mortyID,
  lastName: 'Smith',
  loggedOffTimeStamp: null,
  memories: {},
  pending: {},
  phoneNumber: null,
  profilePicUrl: MortyPic,
  received: 0,
  story: {},
  sent: 0,
  streakEmoji: '\u{1F525}',
  username: 'aw-jeez123',
};

export const Rick = {
  addedMe: {},
  brokeup: {},
  created: newDate,
  deleteSnaps: {},
  email: 'Rick@Guest.com',
  faceIDURL: null,
  friends: {},
  firstName: 'Rick',
  id: rickID,
  lastName: 'Sanchez',
  loggedOffTimeStamp: null,
  memories: {},
  pending: {},
  phoneNumber: null,
  profilePicUrl: RickPic,
  received: 0,
  story: {},
  sent: 0,
  streakEmoji: '\u{1F525}',
  username: 'Rick-C-137',
};

export const Everyone = {
  [guestID]: {
    created: Guest['created'],
    email: Guest['email'],
    firstName: Guest['firstName'],
    id: Guest['id'],
    lastName: Guest['lastName'],
    lastTimeStamp: Guest['lastTimeStamp'],
    phoneNumber: Guest['phoneNumber'],
    profilePicUrl: Guest['profilePicUrl'],
    username: Guest['username'],
  },
  [mortyID]: {
    created: Morty['created'],
    email: Morty['email'],
    firstName: Morty['firstName'],
    id: Morty['id'],
    lastName: Morty['lastName'],
    lastTimeStamp: Morty['lastTimeStamp'],
    phoneNumber: Morty['phoneNumber'],
    profilePicUrl: Morty['profilePicUrl'],
    username: Morty['username'],
  },
  [rickID]: {
    created: Rick['created'],
    email: Rick['email'],
    firstName: Morty['firstName'],
    id: Rick['id'],
    lastName: Morty['lastName'],
    lastTimeStamp: Rick['lastTimeStamp'],
    phoneNumber: Rick['phoneNumber'],
    profilePicUrl: Rick['profilePicUrl'],
    username: Rick['username'],
  },
};

export const FakeDB = {
  [guestID]: Guest,
  [rickID]: Rick,
  [mortyID]: Morty,
};

/**
 * @export
 * @param {*} user
 * @return {*}
 */
export function createUserEntry(user) {
  const date = new Date().toLocaleString();
  return {
    addedMe: {},
    allSnapsSent: {},
    brokeup: {},
    created: date,
    email: user.email,
    faceIDURL: null,
    firstName: user.displayName,
    friends: {
      [user.uid]: {
        created: date,
        email: user.email,
        firstName: user.displayName,
        id: user.uid,
        lastName: null,
        phoneNumber: null,
        profilePicUrl: user.photoURL,
        username: null,
        friendship: date,
        lastTimeStamp: null,
        messages: {},
        newSnaps: {},
        nickname: null,
        openedByMe: {
          lastTimeStamp: null,
          opened: 0,
        },
        openedByFriend: {
          lastTimeStamp: null,
          opened: 0,
        },
        readSnaps: [],
        received: {
          lastTimeStamp: null,
          receivedSnaps: 0,
        },
        sent: {
          lastTimeStamp: null,
          sentSnaps: 0,
        },
        status: 'new-friend',
        streak: 0,
        streakRef: null,
      },
    },
    id: user.uid,
    lastName: null,
    loggedOffTimeStamp: null,
    memories: {},
    pending: {},
    phoneNumber: user.phoneNumber,
    profilePicUrl: user.photoURL,
    received: 0,
    story: {},
    sent: 0,
    snapTime: -1,
    stayLoggedIn: false,
    streakEmoji: '\u{1F525}',
    username: null,
  };
}

/**
 * @export
 * @param {*} user
 * @return {*}
 */
export function createEveryoneEntry(user) {
  const date = new Date().toLocaleString();
  return {
    created: date,
    email: user.email,
    firstName: user.displayName,
    id: user.uid,
    lastName: null,
    lastTimeStamp: null,
    phoneNumber: user.phoneNumber,
    profilePicUrl: user.photoURL,
    username: null,
  };
}
