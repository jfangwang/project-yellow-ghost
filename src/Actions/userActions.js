export const EDIT_USER = 'user/editUser';
export const EDIT_FAKE_DB = 'user/editFakeDB';
export const EDIT_EVERYONE = 'user/editEveryone';
export const LOGGED_IN = 'user/loggedIn';
export const LOGGED_OUT = 'user/loggedOut';

/**
 * @export
 * @param {*} user
 * @return {*}
 */
export function editUser(user) {
  return {
    type: EDIT_USER,
    user: user,
  };
}

/**
 * @export
 * @param {*} fakeDB
 * @return {*}
 */
export function editFakeDB(fakeDB) {
  return {
    type: EDIT_FAKE_DB,
    fakeDB: fakeDB,
  };
}

/**
 * @export
 * @param {*} everyone
 * @return {*}
 */
export function editEveryone(everyone) {
  return {
    type: EDIT_EVERYONE,
    everyone: everyone,
  };
}

/**
 * @export
 * @return {*}
 */
export function loggedIn() {
  return {
    type: LOGGED_IN,
  };
}

/**
 * @export
 * @return {*}
 */
export function loggedOut() {
  return {
    type: LOGGED_OUT,
  };
}
