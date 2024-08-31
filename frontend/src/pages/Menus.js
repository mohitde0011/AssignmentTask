import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRecoilState, } from 'recoil';
import Input from "../components/atoms/Input";
import Button from "../components/atoms/Button";
import openFolder from "../assets/images/icons/openfolder.svg";
import menu2 from "../assets/images/icons/menu2.svg";

import { Icons } from '../assets/Icons';
import DeleteModal from "../components/atoms/DeleteModel"
import { addMenu, deleteMenu, fetchAllMenus, fetchMenu, fetchParentMenus, updateMenu } from '../api';
import { errorState, expandItState, formStateState, parentSelectionDataState, selectedMenuState, treeDataState } from '../recoil/atoms/MenuTree';
import TreeMenu from '../components/atoms/TreeMenu';



function transformParentData(data) {
  const result = [];

  function traverse(obj) {
    if (obj.id && obj.name) {
      result.push({ id: obj.id.toString(), label: obj.name });
    }
    if (obj.children) {
      Object.values(obj.children).forEach((child) => traverse(child));
    }
  }

  if (Array.isArray(data)) {
    data.forEach((item) => traverse(item));
  } else if (typeof data === "object" && data !== null) {
    Object.values(data).forEach((item) => traverse(item));
  }

  return result;
}

const transformData = (data) => {
  const transform = (menu) => {
    return {
      id: menu.id,
      name: menu.name,
      children: menu.children
        ? Object.values(menu.children).map(transform)
        : [],
    };
  };

  const dataArray = Array.isArray(data) ? data : Object.values(data);

  return dataArray.map(transform);
};


const defaultState = { id: "", name: "", depth: "", parent: "" };
const defaultError = { name: "", depth: "" };

export default function Menus() {
  const [treeData, setTreeData] = useRecoilState(treeDataState);
  const [expandIt, setExpandIt] = useRecoilState(expandItState);
  const [error, setError] = useRecoilState(errorState);
  const [selectedMenu, setSelectedMenu] = useRecoilState(selectedMenuState);
  const [formState, setFormState] = useRecoilState(formStateState);
  const [parentSelectionData, setParentSelectionData] = useRecoilState(parentSelectionDataState);

  const queryClient = useQueryClient();

  const { data: allMenusData, isLoading: isAllMenusLoading } = useQuery({
    queryKey: ["AllMenu"],
    queryFn: fetchAllMenus,
  });

  const { data: sigleMenu, isLoading: isSigleMenuLoading } = useQuery({
    queryKey: ["singleData", selectedMenu?.id],
    queryFn: () => fetchMenu(selectedMenu?.id),
    enabled: (!!selectedMenu?.id && selectedMenu?.isEdit)
  });

  useEffect(() => {
    if (!sigleMenu) return;
    setFormState({ ...sigleMenu?.data?.data, name: selectedMenu?.name});
  }, [sigleMenu, setFormState]);

  const { data: parentMenusData, isLoading: isParentMenusLoading } = useQuery({
    queryKey: ["AllParentMenus", selectedMenu?.id],
    queryFn: () => fetchParentMenus(selectedMenu?.id),
    enabled: (!!selectedMenu?.id && selectedMenu?.isEdit === true)
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
    if (!selectedMenu || selectedMenu.isEdit) return;
    setFormState({ ...defaultState });
  }, [selectedMenu, setFormState]);

  useEffect(() => {
    if (!allMenusData) return;
    const transformedData = transformData(allMenusData.data.data);
    setTreeData(transformedData);
  }, [allMenusData, setTreeData]);

  useEffect(() => {
    if (!parentMenusData?.data?.data) return;
    setParentSelectionData(transformParentData(parentMenusData.data.data));
  }, [parentMenusData, setParentSelectionData]);

  const handleMenuSelection = (menu, action) => {
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
    } else if (parseInt(formState.depth) < 0) {
      newError.depth = "Depth must be non-negative";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAllValid()) return;

    const formData = new FormData();
    formData.append("name", formState?.name);
    formData.append("depth", formState?.depth);

    if (selectedMenu.isEdit) {
      formData.append("parent", (formState?.parent));
      formData.append("id", formState?.id);
      updateThisMenu(formData);
    } else {
      formData.append("parent", +selectedMenu?.parent);
      addNewMenu(formData);
    }
  };

  return (
    <>
      <div className="flex-1 bg-white p-6 pl-4 mt-9 md:mt-0">
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
        <div className="flex w-full justify-between flex-col-reverse    md:flex-row gap-8 md:gap-1">
          <div className="w-full">
            <div className="flex mb-3">
              <button
                onClick={() => setExpandIt(true)}
                className={`${expandIt ? "bg-[#1d2939] text-white " : "   bg-gray-200 text-[#475467] border border-[#d0d5dd]"}  first-letter: px-4 py-2 rounded-full mr-4`}
              >
                Expand All
              </button>
              <button
                onClick={() => setExpandIt(false)}
                className={`${!expandIt ? "bg-[#1d2939] text-white" : "bg-gray-200 text-[#475467] border border-[#d0d5dd]"} px-4 py-2 rounded-full `}
              >
                Collapse All
              </button>
            </div>

            {!isAllMenusLoading ? <div className="mb-6 rounded-md p-4 w-full">
              {treeData?.length > 0 && treeData.map((menu) => (
                <TreeMenu
                  key={menu.id}
                  menu={menu}
                  setSelectedMenu={handleMenuSelection}
                  selectedMenu={selectedMenu}
                  expandIt={expandIt}
                />
              ))}
            </div> : <div className='flex  py-7 justify-center'><img className='h-7' src={Icons.loader} /></div>}

          </div>

          <form onSubmit={handleSubmit} className="bg-gray-100 p-4 pt-0 rounded-md w-full">
            <div className="mb-4">
              <Input
                label="MenuID"
                disabled={true}
                className="w-full bg-[#f4f7fa] text-[#667085]"
                value={!selectedMenu?.isEdit ? "" : formState?.id}
              />
            </div>
            <div className="mb-4">
              <Input
                label="Depth"
                name="depth"
                type="number"
                disabled={selectedMenu?.isEdit === true}
                error={error?.depth}
                handleChange={handleInputChange}
                className="bg-[#f4f7fa] text-[#667085] rounded-md"
                value={formState.depth}
              />
            </div>
            <div className="mb-6">
              <label className="block  text-sm font-medium text-[#475467]">Parent</label>
              <select
                disabled={!parentSelectionData.length || !selectedMenu.isEdit}
                className="w-64 disabled:cursor-not-allowed border rounded-md p-2 bg-[#f4f7fa] font-medium text-[#1d2939] outline-none border-none"
                defaultValue={selectedMenu.parent}
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
                className="bg-[#f4f7fa] text-[#667085] rounded-md"
                value={formState.name}
              />
            </div>
            <Button title={!treeData?.length ? false : (selectedMenu.id === "") ? "Click a menu on the left to edit, or hover and click '+' to add a new menu": ""} type='submit' loading={isUpdateMenuPending || isAddNewMenuPending || isSigleMenuLoading || isParentMenusLoading} onClick={handleSubmit} disabled={!treeData?.length ? false : (selectedMenu.id === "")}>
              {selectedMenu.isEdit ? "Save" : "Add"}
            </Button>
          </form>
        </div>
      </div>
      {selectedMenu.isDelete && (
        <DeleteModal
          deleteCallback={() => deleteSelectedMenu(selectedMenu.id)}
          loading={isDeleteMenuPending}
          message={<>Are you sure you want to delete this Menu <b>&apos;{selectedMenu.name}&apos;</b>?</>}
          closeModal={() => setSelectedMenu(prev => ({ ...prev, isDelete: false }))}
        />
      )}
    </>
  );
}