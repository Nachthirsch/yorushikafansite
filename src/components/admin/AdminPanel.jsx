import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import ThemeSwitcher from "../ThemeSwitcher";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { motion, AnimatePresence } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { DocumentTextIcon, MusicalNoteIcon, ArchiveBoxIcon, ChartBarIcon, Bars3Icon, XMarkIcon, PlusIcon, CommandLineIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const tabItems = [
  { name: "Dashboard", icon: <ChartBarIcon className="h-5 w-5" />, shortcut: "1" },
  { name: "Posts", icon: <DocumentTextIcon className="h-5 w-5" />, shortcut: "2" },
  { name: "Albums", icon: <ArchiveBoxIcon className="h-5 w-5" />, shortcut: "3" },
  { name: "Songs", icon: <MusicalNoteIcon className="h-5 w-5" />, shortcut: "4" },
];

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Keyboard shortcuts
  useHotkeys("ctrl+/", () => setHelpModalOpen(true));
  useHotkeys("ctrl+b", () => setSidebarOpen((prev) => !prev));
  useHotkeys("shift+1", () => setActiveTab(0));
  useHotkeys("shift+2", () => setActiveTab(1));
  useHotkeys("shift+3", () => setActiveTab(2));
  useHotkeys("shift+4", () => setActiveTab(3));
  useHotkeys("ctrl+d", () => setIsDarkMode(!isDarkMode));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-base-100 to-base-200 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>{sidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setSidebarOpen(false)} />}</AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? "16rem" : "0rem",
          opacity: sidebarOpen ? 1 : 0,
        }}
        className={`fixed lg:relative z-30 h-full overflow-hidden bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${sidebarOpen ? "block" : "hidden lg:block"}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold">Y</span>
              </div>
              <h1 className="text-lg font-bold tracking-wide text-gray-800 dark:text-white">Yorushika</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
              <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
            {tabItems.map((item, index) => (
              <button key={item.name} onClick={() => setActiveTab(index)} className={`flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 ${activeTab === index ? "bg-primary/10 text-primary" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                <span className="flex items-center justify-center w-8 h-8">{item.icon}</span>
                <span className="ml-3 font-medium">{item.name}</span>
                <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">{item.shortcut}</kbd>
              </button>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                {isDarkMode ? (
                  <>
                    <SunIcon className="w-4 h-4" /> <span>Light</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-4 h-4" /> <span>Dark</span>
                  </>
                )}
              </button>
              <button onClick={() => setHelpModalOpen(true)} className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary">
                <CommandLineIcon className="w-4 h-4" />
                <span>Shortcuts</span>
              </button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center space-x-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Toggle sidebar">
                <Bars3Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              <nav className="hidden sm:block">
                <ol className="flex items-center space-x-2 text-sm">
                  <li className="text-gray-500 dark:text-gray-400">Admin</li>
                  <li className="text-gray-400 dark:text-gray-500">/</li>
                  <li className="text-primary font-medium">{tabItems[activeTab].name}</li>
                </ol>
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <button className="btn btn-primary btn-sm gap-2">
                  <PlusIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Create New</span>
                </button>
                {/* Dropdown could be added here */}
              </div>

              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content scrollable area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-0">
          {/* Tab interface */}
          <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Tab.List className="flex overflow-x-auto no-scrollbar">
                {tabItems.map((item, index) => (
                  <Tab key={item.name} className={({ selected }) => `py-4 px-6 outline-none whitespace-nowrap transition-all duration-200 border-b-2 font-medium text-sm ${selected ? "border-primary text-primary" : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"}`}>
                    <div className="flex items-center space-x-2">
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <div className="p-4 md:p-6">
              {/* Action buttons */}
              <div className="mb-6 flex flex-wrap gap-2 items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{tabItems[activeTab].name}</h1>

                <div className="flex flex-wrap gap-2">
                  {activeTab === 1 && <button className="btn btn-primary btn-sm">New Post</button>}
                  {activeTab === 2 && <button className="btn btn-primary btn-sm">Add Album</button>}
                  {activeTab === 3 && <button className="btn btn-primary btn-sm">Add Song</button>}
                </div>
              </div>

              {/* Tab panels */}
              <Tab.Panels className="mt-2">
                <Tab.Panel>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Dashboard Stats Cards */}
                    {[
                      { title: "Total Posts", value: "24", icon: DocumentTextIcon },
                      { title: "Albums", value: "12", icon: ArchiveBoxIcon },
                      { title: "Songs", value: "86", icon: MusicalNoteIcon },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="p-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <stat.icon className="w-6 h-6 text-primary" />
                              </div>
                            </div>
                            <div className="ml-5">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* More dashboard content would go here */}
                  <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                      <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                              <DocumentTextIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">New post published</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">"Evolution of Yorushika's Sound" was published</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 hours ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                      <p className="text-center py-8 text-gray-500 dark:text-gray-400">Content Panel</p>
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                      <p className="text-center py-8 text-gray-500 dark:text-gray-400">Albums Panel</p>
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                      <p className="text-center py-8 text-gray-500 dark:text-gray-400">Songs Panel</p>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </div>
          </Tab.Group>
        </main>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {helpModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setHelpModalOpen(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
                  <button onClick={() => setHelpModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { shortcut: "Ctrl + /", description: "Show keyboard shortcuts" },
                    { shortcut: "Ctrl + B", description: "Toggle sidebar" },
                    { shortcut: "Shift + 1-4", description: "Switch tabs" },
                    { shortcut: "Ctrl + D", description: "Toggle dark mode" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{item.description}</span>
                      <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded font-mono">{item.shortcut}</kbd>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// This is a placeholder component to be replaced with actual dashboard content
const DashboardOverview = () => {
  return <div>Dashboard Overview Content</div>;
};

export default AdminPanel;
