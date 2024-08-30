import apiClient from "./apiClient";
import { API_ROUTES } from "./apiRoutes";
const staticData = [
    {
        "id": 1,
        "name": "System management",
        "children": {
            "1": {
                "id": 2,
                "name": "System management",
                "children": {
                    "2": {
                        "id": 3,
                        "name": "Systems",
                        "children": {
                            "4": {
                                "id": 5,
                                "name": "System Code",
                                "children": {
                                    "5": {
                                        "id": 6,
                                        "name": "Code Registration"
                                    }
                                }
                            },
                            "6": {
                                "id": 7,
                                "name": "Code Registration - 2"
                            },
                            "7": {
                                "id": 8,
                                "name": "Properties"
                            },
                            "8": {
                                "id": 9,
                                "name": "Menus",
                                "children": {
                                    "9": {
                                        "id": 10,
                                        "name": "Menu Registration"
                                    }
                                }
                            },
                            "10": {
                                "id": 11,
                                "name": "API List",
                                "children": {
                                    "12": {
                                        "id": 13,
                                        "name": "API Edit"
                                    }
                                }
                            }
                        }
                    },
                    "3": {
                        "id": 4,
                        "name": "Users & Groups"
                    },
                    "11": {
                        "id": 12,
                        "name": "My Menu"
                    },
                    "13": {
                        "id": 14,
                        "name": "My menu"
                    }
                }
            }
        }
    }
];

export const fetchAllMenus = async () => {
    try {
        const  response = await apiClient.get(API_ROUTES.GET_ALL_MENUS);
        return  response;
        // return staticData;
    } catch (error) {
        throw error.response;
    }

};

export const fetchMenu = async (id) => {
    try {
        const response = await apiClient.get(API_ROUTES.GET_MENU+id);
        return  response;
       
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
export const updateMenu = async ( formData) => {
    try {
        const response = await apiClient.post(API_ROUTES.UPDATE_MENU , formData);
        return response;
    } catch (error) {
        throw error.response;
    }

};

export const addMenu = async (formData) => {
    try {
        const response = await apiClient.post(API_ROUTES.ADD_MENU,formData);
        return response;
    } catch (error) {
        throw error.response;
    }

};

export const fetchParentMenus = async (id) => {
    try {
        const response = await apiClient.get(API_ROUTES.GET_PARENT_MENUS + id);
        console.log(response)
        return response;
    } catch (error) {
        throw error.response;
    }

};