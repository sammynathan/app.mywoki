import { Outlet, useLocation } from "react-router-dom"

export default function BareLayout() {
  const location = useLocation()
  
  console.log("🔍 BareLayout rendering at:", location.pathname)

  return (
    <div>
      <h1 style={{ 
        backgroundColor: 'red', 
        color: 'white', 
        padding: '20px',
        fontSize: '24px'
      }}>
        BARE LAYOUT - Path: {location.pathname}
      </h1>
      
      {/* Direct div to see if ANYTHING renders */}
      <div style={{
        backgroundColor: 'yellow',
        padding: '30px',
        border: '5px solid black',
        margin: '20px'
      }}>
        <p style={{ color: 'black', fontSize: '20px' }}>ABOVE OUTLET</p>
        
        {/* The Outlet */}
        <Outlet />
        
        <p style={{ color: 'black', fontSize: '20px' }}>BELOW OUTLET</p>
      </div>
    </div>
  )
}