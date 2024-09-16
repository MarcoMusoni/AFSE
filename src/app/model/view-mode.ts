export type ViewMode = 'ALBUM' | 'BARTERS' | 'HERO' | 'LOGIN' | 'SHOP' | 'SIGNUP' | 'USER';
export type ViewSignalData = { 
    mode: ViewMode,
    data?: any
}