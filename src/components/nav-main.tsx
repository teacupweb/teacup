import { type Icon } from '@tabler/icons-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link, useLocation } from 'react-router';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    disabled?: boolean;
  }[];
}) {
  const location = useLocation().pathname;
  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2 border-t border-sidebar-border pt-5'>
        <SidebarMenu>
          {items.map((item) => {
            if (item?.disabled == true) {
              return (
                <button key={item.title} disabled>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <div className='flex cursor-not-allowed hover:opacity-100 opacity-50 hover:bg-transparent text-gray-600'>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </button>
              );
            }
            return (
              <Link to={item.url} key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location === item.url /*  */}
                    tooltip={item.title}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
