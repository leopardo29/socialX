"use client";

import React, { useCallback } from "react";
import { BadgeCheckIcon, Dot, Ellipsis, LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import { useStore } from "@/hooks/useStore";
import cn from "classnames";


interface PropsType {
  label?: string;
  href?: string;
  icon?: LucideIcon;
  isUser?: boolean;
  alert?: boolean;
  userInfo?: {
    profileImgUrl: string;
    username: string;
    name: string;
  };
  onClick?: () => void;
}

const SidebarItem: React.FC<PropsType> = ({
  userInfo = null,
  isUser = false,
  label,
  icon: Icon,
  onClick,
  href,
  alert,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { onOpenProModal } = useStore();

  const handleClick = useCallback(() => {
    if (onClick) onClick();
    if (href && href !== "#premium") {
      router.push(href);
    }
  }, [router, onClick, href]);

  const handleOpenModal = useCallback(() => {
    if (href === "#premium") {
      onOpenProModal();
    }
  }, [href, onOpenProModal]);

  // Determina si la ruta actual coincide con el href
  const activePath = href ? pathname === href : false;
  const renderIcon = () => {
    if (label === "Grok") {
      // Usar Logo en vez del ícono asignado originalmente para Grok.
      return <Logo width="28px" height="28px" className="lg:w-8 lg:h-8" />;
    } else if (label === "Premium") {
      // Usar BadgeCheckIcon en vez de Logo para Premium.
      return <BadgeCheckIcon size={28} className="lg:w-8 lg:h-8 text-[#14171A] dark:text-white group-hover:text-indigo-900" />;
    } else {
      return Icon ? <Icon size={28} className="" /> : null;
    }
  };

  return (
    <a
    onClick={href === "#premium" ? handleOpenModal : handleClick}
    className={cn(
      "group flex mt-4 items-center w-[2.50em] lg:w-full ml-2  lg:p-3 rounded-lg transition-all duration-100 cursor-pointer",
      "hover:dark:bg-gradient-to-br hover:dark:from-neutral-800 hover:dark:via-slate-900 hover:dark:to-[#2e2e2e2e] hover:dark:shadow-sm",
      "focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",
      activePath
        ? "bg-slate-500 dark:bg-gradient-to-br from-neutral-800 via-slate-800 to-[#2e2e2e2e] shadow-sm dark:text-green-700 font-semibold"
        : "text-slate-950 dark:text-white hover:dark:text-indigo-900"
    )}
  >
       {/* Versión móvil: se oculta en pantallas grandes */}
       <div className="flex items-center justify-center lg:hidden  p-1">
        {isUser && userInfo ? (
          <Avatar className="h-14 w-14">
            <AvatarImage src={userInfo.profileImgUrl} className="object-cover" />
            <AvatarFallback className="font-bold text-[18px]">
              {userInfo.name[0]}
            </AvatarFallback>
          </Avatar>
        ) : (
          <>
            {/* Para móviles: si es Premium se muestra Logo, pero aquí lo cambiamos mediante renderIcon */}
            {renderIcon()}
            {alert && (
              <Dot size={70} className="text-primary absolute -top-4 left-0" />
            )}
          </>
        )}
      </div>

      {/* Versión escritorio: solo se muestra en pantallas grandes */}
      <div
        className="hidden lg:flex gap-4 items-center w-full relative"
        onClick={handleOpenModal}
      >
        {isUser && userInfo ? (
          <div className="flex w-full justify-between gap-2">
            <div className="flex-1 text-left">
              <h3 className="text-[16px] text-[#14171A] dark:text-white block max-w-[150px] truncate font-bold leading-tight">
                {userInfo.name}
              </h3>
              <p className="text-[15px] !text-[#959fa8] block max-w-[120px] truncate font-medium">
                @{userInfo.username}
              </p>
            </div>
            <div className="shrink-0 flex justify-end">
              <Ellipsis />
            </div>
          </div>
        ) : (
          <>
            {/* Para escritorio: aplicamos la misma lógica */}
            {renderIcon()}
            <span className="hidden lg:block text-[#14171A] dark:text-white  text-xl font-bold">
              {label}
            </span>
            {alert && (
              <Dot size={70} className="text-primary absolute -top-8 -left-4" />
            )}
          </>
        )}
      </div>
    </a>
  );
};

export default SidebarItem;
