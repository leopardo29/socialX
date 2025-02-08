"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    BadgeCheckIcon,
  Bell,
  
  Feather,
  Home,
  LucideIcon,
  Search,
  Settings,
  User,
  
} from "lucide-react";
import Logo from "@/components/logo";
import SidebarItem from "./_common/SidebarItem";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/spinner";

import { useCurrentUserContext } from "@/context/currentuser-provider";
import { doLogout } from "../../actions/auth.action";
import PostFormModal from "./_common/PostFormModal";


interface MenuType {
  label: string;
  href?: string;
  icon?: LucideIcon;
  alert?: boolean;
  
}

const Sidebar = (props: { isPro: boolean }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  const { isPro } = props;

  const router = useRouter();
  const { data, isLoading } = useCurrentUserContext();
  const fetchedUser: UserType = data?.currentUser ?? ({} as UserType);
  const username = fetchedUser?.username ?? "";

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="icon" />
      </div>
    );
  }

  console.log(fetchedUser?.hasNotification, "fetchedUser?.hasNotification");

  const MENU_LIST: MenuType[] = [
    {
      label: "Home",
      href: "/home",
      icon: Home,
    
    },
    {
      label: "Search",
      href: "/search",
      icon: Search,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      alert: fetchedUser?.hasNotification || false,
    },
    {
      label: "Grok",
      href: "/deepseek",
      icon:BadgeCheckIcon,
      
    },

    
    ...(isPro
      ? []
      : [
          {
            label: "Premium",
            href: "#premium",
            
          },
        ]),
    {
      label: "Profile",
      href: `/${username}`,
      icon: User,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];
  return (
    <aside
      className="
            w-full fixed h-screen pr-0
            lg:pr-6 overflow-y-auto overflow-x-hidden
        bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black "
    >
      <div
        className="flex flex-col h-full 
          items-start"
      >
        <div
          className="space-y-0 h-full 
                  pb-3 flex flex-col
         justify-between w-auto lg:w-[230px]"
        >
          <div className="flex-1">
            <div className="my-2 pt-1 px-4">
              <Logo
                className="lg:!h-11 lg:!w-11 !h-8 !w-8 cursor-pointer"
                width="auto"
                height="auto"
                onClick={() => router.push("/home")}
              />
            </div>
            {MENU_LIST.map((item) => {
              return (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  alert={item.alert}
                />
              );
            })}
            <div className="w-full pt-4">
              <div>
                <Button
                 onClick={() => setIsModalOpen(true)}
                  variant="brandPrimary"
                  size="icon"
                  className="
                mt-0 lg:hidden rounded-full
                ml-1 h-12 w-12 p-4 flex items-center justify-center
                hover:bg-opacity-80
                transition
                "
                >
                  <Feather size={24} color="white" />
                </Button>
                <Button
                    onClick={() => setIsModalOpen(true)}
                  variant="brandPrimary"
                  className="w-full hidden lg:block
                  !pt-4
                  !py-2
                  !h-auto
                  !text-white
                  transition
                  font-semibold
                  text-[20px]
                                  "
                >
                  Post
                </Button>
                <PostFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} 
                    placeholder="What is happening"/>
              </div>
            </div>
          </div>
          <div
            className="shrink  w-full flex 
                  items-center
           justify-between"
          >
            {isLoading ? (
              <Spinner size="lg" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="!outline-none">
                  <SidebarItem
                    isUser={true}
                    userInfo={{
                      username: fetchedUser?.username || "",
                      name: fetchedUser?.name || "",
                      profileImgUrl: fetchedUser?.profileImage || "",
                    }}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <form action={doLogout} className="flex flex-col rounded-md p-2">
                      <button
                        type="submit"
                        className="w-full flex flex-row items-center gap-2 
                     text-base !cursor-pointer
                      "
                      >
                        Log out{" "}
                        <span className="block max-w-[120px] truncate ml-1">
                          @{fetchedUser?.name}
                          
                        </span>
                       
                      </button>
                      <button 
                      type="submit"
                      className="w-full flex flex-row items-center gap-2 
                     text-base !cursor-pointer"

                      >
                        Add an existing account{" "}
                        <span className="block max-w-[120px] truncate ml-1">
                       
                          
                        </span>

                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
