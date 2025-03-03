import React from "react";
import { Tab } from "@headlessui/react";
import { useAdmin } from "../../contexts/AdminContext";

const TabPanels = React.memo(function TabPanels() {
  const [state] = useAdmin();

  return (
    <Tab.Panels>
      <Tab.Panel>
        <DashboardPanel stats={state.stats} />
      </Tab.Panel>
      <Tab.Panel>
        <BlogPostsPanel posts={state.posts} />
      </Tab.Panel>
      <Tab.Panel>
        <AlbumsPanel albums={state.albums} />
      </Tab.Panel>
      <Tab.Panel>
        <SongsPanel songs={state.songs} albums={state.albums} />
      </Tab.Panel>
      <Tab.Panel>
        <SongsManagementPanel songs={state.songs} />
      </Tab.Panel>
    </Tab.Panels>
  );
});

export default TabPanels;
