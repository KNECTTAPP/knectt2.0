
export const createAppsFlyerSlice = (set) => ({
  appsFlyerData: null, 
  affiliateLink:null,
  affiliateCode:null,

  // Just a setter (you call this manually when you get data)
  setAppsFlyerData: (data) => set({ appsFlyerData: data }),
  setAffiliateLink:(data)=> set({affiliateLink:data}),
  setAffiliateCode:(data)=>set({affiliateCode:data})
});