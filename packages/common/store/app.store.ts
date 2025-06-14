'use client';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const SETTING_TABS = {
    API_KEYS: 'api-keys',
    MCP_TOOLS: 'mcp-tools',
    CREDITS: 'credits',
    PERSONALIZATION: 'personalization',
} as const;

type SideDrawerProps = {
    open: boolean;
    badge?: number;
    title: string | (() => React.ReactNode);
    renderContent: () => React.ReactNode;
};

type State = {
    isSidebarOpen: boolean;
    isSourcesOpen: boolean;
    isSettingsOpen: boolean;
    showSignInModal: boolean;
    settingTab: (typeof SETTING_TABS)[keyof typeof SETTING_TABS];
    sideDrawer: SideDrawerProps;
    isAppLoading: boolean;
    openSideDrawer: (props: Omit<SideDrawerProps, 'open'>) => void;
    dismissSideDrawer: () => void;
    updateSideDrawer: (props: Partial<SideDrawerProps>) => void;
    setIsAppLoading: (loading: boolean) => void;
};

type Actions = {
    setIsSidebarOpen: (isSidebarOpen: (prev: boolean) => boolean) => void;
    setIsSourcesOpen: (isSourcesOpen: (prev: boolean) => boolean) => void;
    setIsSettingsOpen: (isSettingsOpen: boolean) => void;
    setSettingTab: (tab: (typeof SETTING_TABS)[keyof typeof SETTING_TABS]) => void;
    setShowSignInModal: (show: boolean) => void;
    openSideDrawer: (props: Omit<SideDrawerProps, 'open'>) => void;
    dismissSideDrawer: () => void;
    updateSideDrawer: (props: Partial<SideDrawerProps>) => void;
    setIsAppLoading: (loading: boolean) => void;
};

export const useAppStore = create(
    immer<State & Actions>((set, get) => ({
        isSidebarOpen: true,
        isSourcesOpen: false,
        isSettingsOpen: false,
        settingTab: 'credits',
        showSignInModal: false,
        isAppLoading: true,
        setIsSidebarOpen: (prev: (prev: boolean) => boolean) =>
            set({ isSidebarOpen: prev(get().isSidebarOpen) }),
        setIsSourcesOpen: (prev: (prev: boolean) => boolean) =>
            set({ isSourcesOpen: prev(get().isSourcesOpen) }),
        setIsSettingsOpen: (open: boolean) => set({ isSettingsOpen: open }),
        setSettingTab: (tab: (typeof SETTING_TABS)[keyof typeof SETTING_TABS]) =>
            set({ settingTab: tab }),
        setShowSignInModal: (show: boolean) => set({ showSignInModal: show }),
        setIsAppLoading: (loading: boolean) => set({ isAppLoading: loading }),
        sideDrawer: { open: false, title: '', renderContent: () => null, badge: undefined },
        openSideDrawer: (props: Omit<SideDrawerProps, 'open'>) => {
            set({ sideDrawer: { ...props, open: true } });
        },
        updateSideDrawer: (props: Partial<SideDrawerProps>) =>
            set(state => ({
                sideDrawer: { ...state.sideDrawer, ...props },
            })),
        dismissSideDrawer: () =>
            set({
                sideDrawer: { open: false, title: '', renderContent: () => null, badge: undefined },
            }),
    }))
);
