import { create } from 'zustand';
export const useUiStore = create((set) => ({ loading:false, error:null, sidebarOpen:true, toast:null, darkMode:false,
  setLoading:(loading)=>set({loading}), setError:(error)=>set({error}), toggleSidebar:()=>set(s=>({sidebarOpen:!s.sidebarOpen})),
  showToast:(toast)=>set({toast}), clearToast:()=>set({toast:null}), toggleDarkMode:()=>set(s=>({darkMode:!s.darkMode}))
}));
