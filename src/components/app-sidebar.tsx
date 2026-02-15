import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

import { SidebarHeader as CustomSidebarHeader } from '@/components/sidebar-header';
import { SidebarNavigation } from '@/components/sidebar-navigation';
import { SidebarUserSection } from '@/components/sidebar-user-section';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='offcanvas' variant='inset' {...props}>
      <SidebarHeader>
        <CustomSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserSection />
      </SidebarFooter>
    </Sidebar>
  );
}
