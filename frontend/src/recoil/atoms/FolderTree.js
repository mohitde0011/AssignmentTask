// import { atom, selector } from 'recoil';

// export const myFormationState = atom({
//     key: 'myFormation',
//     default: {
//         FWD: 3,
//         MID: 3,
//         DEF: 4,
//         GCK: 1,
//     },
// });

// export const myPlayersState = atom({
//     key: 'MyPlayersState',
//     default: [],
// });

import { atom } from 'recoil';
export const todoListState = atom({
    key: 'todoListState',
    default: ["hi"],
});