import React, { createContext, useState } from "react"

export const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reloadFilter, setReloadFilter] = useState(true);
  const [ datosContx, setDatosContx ] = useState([]);
  const [ colores, setColores ] = useState({
    navPrimary: {
      text: '#000000',
      background: '#FFFFFF',
      hoverText: '#a39c9c',
    },
    navSecondary: {
      text: '#000000',
      background: '#000000',
      hoverText: '#a39c9c',
    },
    bodyPage: {
      text: '#000000',
      background: '#F5F5F5',
      hoverText: '#000000',
      card: {
        text: '#000000',
        background: '#F7F7F7'
      }
    }
  });

  return (
    <MenuContext.Provider value={{active,setActive, loading, setLoading, reloadFilter, setReloadFilter, datosContx, setDatosContx, colores, setColores }}>
      {children}
    </MenuContext.Provider>
  );
};