import apiClient from "./apiClient";
import { API_ROUTES } from "./apiRoutes";

export const fetchAllMenus = async () => {
    try {
        const response = await apiClient.get(API_ROUTES.GET_ALL_MENUS);
        return response;

    } catch (error) {
        throw error.response;
    }

};

export const fetchMenu = async (id) => {
    try {
        const response = await apiClient.get(API_ROUTES.GET_MENU + id);
        return response;

    } catch (error) {
        throw error.response;
    }

};

export const deleteMenu = async (id) => {
    try {
        const response = await apiClient.get(API_ROUTES.DELETE_MENU + id);
        return response;
    } catch (error) {
        throw error.response;
    }

};
export const updateMenu = async (formData) => {
    try {
        const response = await apiClient.post(API_ROUTES.UPDATE_MENU, formData);
        return response;
    } catch (error) {
        throw error.response;
    }

};

export const addMenu = async (formData) => {
    try {
        const response = await apiClient.post(API_ROUTES.ADD_MENU, formData);
        return response;
    } catch (error) {
        throw error.response;
    }

};

export const fetchParentMenus = async (id) => {
    try {
        const response = await apiClient.get(API_ROUTES.GET_PARENT_MENUS + id);

        return response;
    } catch (error) {
        throw error.response;
    }

};