import { MinimaEvents } from "@minima-global/mds"
import { MDS } from "@minima-global/mds"
import { createContext, useEffect, useRef, useState } from "react"

export const appContext = createContext<{
  loaded: boolean
}>({ loaded: false })

const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const initialised = useRef(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true

      MDS.init(async (msg) => {
        if (msg.event === MinimaEvents.INITED) {
          setLoaded(true)
          console.log("MDS initialised and ready! 🚀")
        }
      })
    }
  }, [])

  const context = {
    loaded,
  }

  return <appContext.Provider value={context}>{children}</appContext.Provider>
}

export default AppProvider
