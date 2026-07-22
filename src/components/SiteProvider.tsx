import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultSite, fetchSiteSettings, setCachedSite, type SiteData } from "@/lib/site-content";

type SiteContextValue = {
  site: SiteData;
  refreshSite: () => Promise<void>;
  updateSite: (data: SiteData) => void;
};

const SiteContext = createContext<SiteContextValue>({
  site: defaultSite,
  refreshSite: async () => {},
  updateSite: () => {},
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteData>(defaultSite);

  async function refreshSite() {
    const data = await fetchSiteSettings();
    setCachedSite(data);
    setSite(data);
  }

  function updateSite(data: SiteData) {
    setCachedSite(data);
    setSite(data);
  }

  useEffect(() => {
    refreshSite();
  }, []);

  return (
    <SiteContext.Provider value={{ site, refreshSite, updateSite }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteData {
  return useContext(SiteContext).site;
}

export function useSiteActions() {
  const { refreshSite, updateSite } = useContext(SiteContext);
  return { refreshSite, updateSite };
}
