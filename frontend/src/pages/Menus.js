import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import openFolder from "../assets/images/icons/openfolder.svg";
import menu2 from "../assets/images/icons/menu2.svg";
import arrow from "../assets/images/icons/arrow.svg";
import { Icons } from '../assets/Icons';
import DeleteModal from '../components/atoms/deleteModel';
import { addMenu, deleteMenu, fetchAllMenus, fetchMenu, fetchParentMenus, updateMenu } from '../api';

// Function to transform parent data
function transformParentData(data) {
  const result = [];
  function traverse(obj) {
    if (obj.id && obj.name) {
      result.push({ id: obj.id.toString(), label: obj.name });
    }
    if (obj.children) {
      Object.values(obj.children).forEach(child => traverse(child));
    }
  }
  data.forEach(item => traverse(item));
  return result;
}

// Function to transform the static data into a tree structure

const transformData = (data) => {
  const transform = (menu) => {
    return {
      id: menu.id,
      name: menu.name,
      children: menu.children ? Object.values(menu.children).map(transform) : []
    };
  };
  return data.map(transform);
};

const TreeMenu = ({ menu, depth = 0, expandIt = true, setSelectedMenu, selectedMenu }) => {
  const [isExpanded, setIsExpanded] = useState(expandIt);

  useEffect(() => {
    setIsExpanded(expandIt);
  }, [expandIt]);

  const hasChildren = menu.children && menu.children.length > 0;

  return (
    <div className={`ml-${depth > 0 ? '4' : '0'}`}>
      <div className="flex items-center">
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-1 focus:outline-none"
          >
            <img src={arrow} className={`${isExpanded ? "" : "rotate-180"}`} alt="Expand/Collapse" />
          </button>
        )}
        {!hasChildren && <div className="w-4 h-4 mr-1" />}
        <span className={`cursor-pointer group flex items-center gap-1 ${selectedMenu?.id === menu?.id ? "font-semibold" : ""}`}>
          <button onClick={() => setSelectedMenu(menu, 'edit')}>{menu.name}</button>
          <div className='items-center gap-2 hidden group-hover:flex'>
            <button onClick={() => setSelectedMenu(menu, 'add')}>
              <img className='h-7' src={Icons.plus} alt="Add" />
            </button>
            <button onClick={() => setSelectedMenu(menu, 'delete')}>
              <img className='h-7' src={Icons.bin} alt="Delete" />
            </button>
          </div>
        </span>
      </div>
      {isExpanded && hasChildren && (
        <div className="ml-4 mt-1 border-l border-gray-300">
          {menu.children?.length > 0 && menu.children.map((childMenu) => (
            <div key={childMenu.id} className="relative">
              <div className="absolute top-3 w-3 border-t border-gray-300" />
              <TreeMenu
                menu={childMenu}
                depth={depth + 1}
                setSelectedMenu={setSelectedMenu}
                selectedMenu={selectedMenu}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const defaultState = { id: "", name: "", depth: "", parent: "" };
const defaultError = { name: "", depth: "" };

export default function Menus() {
  const [treeData, setTreeData] = useState(null);
  const [expandIt, setExpandIt] = useState(true);
  const [error, setError] = useState({ ...defaultError });
  const [selectedMenu, setSelectedMenu] = useState({ ...defaultState });
  const [selectedMenuForEdit, setselectedMenuForEdit] = useState(null);
  const [formState, setFormState] = useState({ ...defaultState });
  const [parentSelectionData, setParentSelectionData] = useState([]);

  const queryClient = useQueryClient();

  const { data: allMenusData, isLoading: isAllMenusLoading } = useQuery({
    queryKey: ["AllMenu"],
    queryFn: fetchAllMenus,
  });

  const { data: sigleMenu, isLoading: isSigleMenuLoading } = useQuery({
    queryKey: [formState?.id],
    queryFn: () => fetchMenu(selectedMenu?.id),
    enabled: (!!selectedMenu?.id && selectedMenu.isEdit)
  });
  console.log(sigleMenu)

  useEffect(() => {
    if (!sigleMenu) return
    console.log(sigleMenu)
    setFormState(sigleMenu?.data?.data)
  }, [sigleMenu])

  const { data: parentMenusData, isLoading: isParentMenusLoading } = useQuery({
    queryKey: ["AllParentMenus", formState?.id],
    queryFn: () => fetchParentMenus(formState?.id),
    enabled: !!formState?.id
  });

  const { mutateAsync: addNewMenu, isPending: isAddNewMenuPending } = useMutation({
    mutationFn: addMenu,
    onSuccess: () => {
      queryClient.invalidateQueries(["AllMenu"]);
      setSelectedMenu({ ...defaultState });
      setFormState({ ...defaultState });
    },
    onError: (error) => {
      console.error("Failed to add menu:", error);
      setFormState({ ...defaultState });

    }
  });

  const { mutateAsync: updateThisMenu, isPending: isUpdateMenuPending } = useMutation({
    mutationFn: updateMenu,
    onSuccess: () => {
      queryClient.invalidateQueries(["AllMenu"]);
      setSelectedMenu({ ...defaultState });
    }
  });

  const { mutateAsync: deleteSelectedMenu, isPending: isDeleteMenuPending } = useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries(["AllMenu"]);
      setSelectedMenu({ ...defaultState });
    }
  });
  useEffect(() => {
    if (!selectedMenu || selectedMenu.isEdit) return
    setFormState({ ...defaultState })
  }, [selectedMenu])

  useEffect(() => {
    if (!allMenusData) return;
    const transformedData = transformData(allMenusData.data.data);
    setTreeData(transformedData);
  }, [allMenusData]);

  useEffect(() => {
    if (!parentMenusData?.data?.data) return;
    setParentSelectionData(transformParentData(parentMenusData.data.data));
  }, [parentMenusData]);

  const handleMenuSelection = (menu, action) => {
    console.log(menu)
    setSelectedMenu({
      ...menu,
      parent: menu.id,
      parentName: menu?.name,
      isEdit: action === 'edit',
      isDelete: action === 'delete'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const isAllValid = () => {
    let newError = { ...defaultError };
    let isValid = true;

    if (!formState.name.trim()) {
      newError.name = "Please Enter Name";
      isValid = false;
    } else if (formState.name.trim().length < 4) {
      newError.name = "Name must be at least 4 characters long.";
      isValid = false;
    }

    if (!formState?.depth && !(formState?.depth + "".trim())) {
      newError.depth = "Please Enter Depth";
      isValid = false;
    } else if (parseInt(formState.depth) < -1) {
      newError.depth = "Depth must be non-negative";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = () => {
    if (!isAllValid()) return;
    console.log("submit", selectedMenu)
    console.log("submit", formState)
    const formData = new FormData();
    if (!selectedMenu.isEdit) {

      formData.append("parent", +selectedMenu?.parent);
    }
    formData.append("name", formState?.name);
    formData.append("depth", formState?.depth);

    if (selectedMenu.isEdit) {
      formData.append("parent", (formState?.parent));
      formData.append("id", formState?.id);

      updateThisMenu(formData);
    } else {

      addNewMenu(formData);
    }
  };

  return (
    <>
      <div className="flex-1 bg-white p-6 pl-4 mt-9 sm:mt-0">
        <div className="text-sm text-gray-500 mb-4 flex items-center">
          <span className="mr-2"><img className="h-5 invert" src={openFolder} alt="Open Folder" /></span>
          / Menus
        </div>
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <span className="text-blue-600 mr-2"><img className="h-10" src={menu2} alt="Menu" /></span>
          Menus
        </h1>
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#475467]">Menu</label>
          <select className="w-64 border rounded-md p-2 bg-[#f9fafb] font-medium text-[#1d2939] outline-none border-none">
            <option>system management</option>
          </select>
        </div>
        <div className="flex w-full justify-between flex-col-reverse sm:flex-row gap-5 sm:gap-0">
          <div className="w-full">
            <div className="flex mb-3">
              <button
                onClick={() => setExpandIt(true)}
                className={`${expandIt ? "bg-[#1d2939] text-white" : "bg-gray-200 text-[#475467] border border-[#d0d5dd]"} hover:bg-[#1d2939] hover:text-white px-4 py-2 rounded-full mr-4`}
              >
                Expand All
              </button>
              <button
                onClick={() => setExpandIt(false)}
                className={`${!expandIt ? "bg-[#1d2939] text-white" : "bg-gray-200 text-[#475467] border border-[#d0d5dd]"} px-4 py-2 rounded-full`}
              >
                Collapse All
              </button>
            </div>

            <> <div className="mb-6 rounded-md p-4 w-full">
              {treeData?.length > 0 && treeData.map((menu) => (
                <TreeMenu
                  key={menu.id}
                  menu={menu}
                  setSelectedMenu={handleMenuSelection}
                  selectedMenu={selectedMenu}
                  expandIt={expandIt}
                />
              ))}
            </div></>

          </div>

          <form className="bg-gray-100 p-4 pt-0 rounded-md w-full">
            <div className="mb-4">
              <Input
                label="MenuID"
                disabled={true}
                className="w-full bg-[#f9fafb] text-[#667085]"
                value={!selectedMenu?.isEdit ? "" : formState?.id}
              />
            </div>
            <div className="mb-4">
              <Input
                label="Depth"
                name="depth"
                error={error?.depth}
                handleChange={handleInputChange}
                className="bg-[#f9fafb] text-[#667085] rounded-md"
                value={formState.depth}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#475467]">Parent</label>
              <select
                disabled={!parentSelectionData.length || !selectedMenu.isEdit}
                className="w-64 border rounded-md p-2 bg-[#f9fafb] font-medium text-[#1d2939] outline-none border-none"
                value={selectedMenu.parent}
                onChange={(e) => setFormState(prev => ({ ...prev, parent: e.target.value }))}
              >
                {selectedMenu.isEdit
                  ? parentSelectionData.map((option) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))
                  : <option value={selectedMenu.id}>{selectedMenu?.parentName}</option>
                }
              </select>
            </div>
            <div className="mb-4">
              <Input
                label="Name"
                name="name"
                error={error?.name}
                handleChange={handleInputChange}
                className="bg-[#f9fafb] text-[#667085] rounded-md"
                value={formState.name}
              />
            </div>
            <Button loading={isUpdateMenuPending || isAddNewMenuPending} onClick={handleSubmit} disabled={selectedMenu.id === ""}>
              {selectedMenu.isEdit ? "Save" : "Add"}
            </Button>
          </form>
        </div>
      </div>
      {selectedMenu.isDelete && (
        <DeleteModal
          deleteCallback={() => deleteSelectedMenu(selectedMenu.id)}
          loading={isDeleteMenuPending}
          message={<>Are you sure you want to delete this Menu {selectedMenu.name}?</>}
          closeModal={() => setSelectedMenu(prev => ({ ...prev, isDelete: false }))}
        />
      )}
    </>
  );
}
























