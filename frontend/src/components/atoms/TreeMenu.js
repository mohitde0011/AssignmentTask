import { useEffect, useState } from "react";
import { Icons } from "../../assets/Icons";

const TreeMenu = ({ menu, depth = 0, expandIt = true, setSelectedMenu, selectedMenu }) => {
    const [isExpanded, setIsExpanded] = useState(expandIt);

    useEffect(() => {
        setIsExpanded(expandIt);
    }, [expandIt]);

    const hasChildren = menu.children && menu.children.length > 0;

    return (
        <div className={`ml-${depth > 0 ? "4" : "0"}`}>
            <div className="flex items-center">
                {hasChildren && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mr-1 focus:outline-none"
                    >
                        <img
                            src={Icons.arrow}
                            className={`${isExpanded ? "" : "rotate-180"}`}
                            alt="Expand/Collapse"
                        />
                    </button>
                )}
                {!hasChildren && <div className="w-4 h-4 mr-1" />}
                <span
                    className={`cursor-pointer group flex items-center h-7 gap-1 ${selectedMenu?.id === menu?.id ? "font-semibold" : ""
                        }`}
                >
                    <button onClick={() => setSelectedMenu(menu, "edit")}>
                        {menu.name}
                    </button>
                    <div className="items-center gap-2 hidden group-hover:flex">
                        <button onClick={() => setSelectedMenu(menu, "add")}>
                            <img className="h-7" src={Icons.plus} alt="Add" />
                        </button>
                        <button onClick={() => setSelectedMenu(menu, "delete")}>
                            <img className="h-7" src={Icons.bin} alt="Delete" />
                        </button>
                    </div>
                </span>
            </div>
            {isExpanded && hasChildren && (
                <div className="ml-4 mt-1 border-l border-gray-300">
                    {menu.children?.length > 0 &&
                        menu.children.map((childMenu) => (
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

export default  TreeMenu