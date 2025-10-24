import Link from "next/link";
import {
  IoBasketOutline,
  IoCalendarOutline,
  IoCheckboxOutline,
  IoCodeWorkingOutline,
  IoListOutline,
  IoPersonOutline,
} from "react-icons/io5";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { SidebarItem } from "./SidebarItem";
import { LogoutButton } from "./LogoutButton";

const items = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: <IoCalendarOutline />,
  },
  {
    path: "/dashboard/rest-todos",
    title: "Rest TODOS",
    icon: <IoCheckboxOutline />,
  },
  {
    path: "/dashboard/server-todos",
    title: "Server Actions",
    icon: <IoListOutline />,
  },
  {
    path: "/dashboard/cookies",
    title: "Cookies",
    icon: <IoCodeWorkingOutline />,
  },
  {
    path: "/dashboard/products",
    title: "Products",
    icon: <IoBasketOutline />,
  },
  {
    path: "/dashboard/profile",
    title: "Profile",
    icon: <IoPersonOutline />,
  },
];

export const Sidebar = async () => {
  const session = await getServerSession(authOptions);

  const username = session?.user?.name ?? "No user";
  const userImage = session?.user?.image ?? "";

  const userRoles = session?.user?.roles ?? [];

  return (
    <aside className="ml-[-100%] fixed z-10 top-0 pb-3 px-6 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
      <div>
        <div className="-mx-6 px-6 py-4">
          <Link href="/dashboard" title="home">
            <div className="w-32">
              {/* <Image
                  src="https://tailus.io/sources/blocks/stats-cards/preview/images/logo.svg"
                  alt="tailus logo"
                  fill
                  priority={false}
                /> */}
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <div className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28">
            {userImage && (
              <Image
                src={userImage}
                alt=""
                height={100}
                width={100}
                priority={false}
              />
            )}
          </div>
          <h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">
            {username}
          </h5>
          <span className="hidden text-gray-400 lg:block capitalize">
            {userRoles.join(", ")}
          </span>
        </div>

        <ul className="space-y-2 tracking-wide mt-8">
          {items.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </ul>
      </div>

      <div className="px-6 -mx-6 pt-4 flex justify-between items-center border-t">
        <LogoutButton />
      </div>
    </aside>
  );
};
