import { atom } from "recoil";

 
export const treeDataState = atom({
    key: 'treeDataState',
    default: null,
});

export const expandItState = atom({
    key: 'expandItState',
    default: true,
});

export const errorState = atom({
    key: 'errorState',
    default: { name: "", depth: "" },
});

export const selectedMenuState = atom({
    key: 'selectedMenuState',
    default: { id: "", name: "", depth: "", parent: "" },
});

export const formStateState = atom({
    key: 'formStateState',
    default: { id: "", name: "", depth: "", parent: "" },
});

export const parentSelectionDataState = atom({
    key: 'parentSelectionDataState',
    default: [],
});