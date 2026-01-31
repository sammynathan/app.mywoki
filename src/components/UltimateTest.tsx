import { useState, useEffect } from 'react'

export default function UltimateTest() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    console.log("🚨 ULTIMATE TEST COMPONENT MOUNTED!")
    setMounted(true)
    
    // Add a DOM element directly
    const div = document.createElement('div')
    div.id = 'ultimate-test-dom'
    div.innerHTML = `
      <div style="
        position: fixed;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: #FF0000;
        color: white;
        padding: 20px;
        z-index: 9999;
        font-size: 24px;
        border: 5px solid yellow;
      ">
        🚨 DOM INJECTION WORKS
      </div>
    `
    document.body.appendChild(div)
    
    return () => {
      document.getElementById('ultimate-test-dom')?.remove()
    }
  }, [])

  return (
    <div style={{
      backgroundColor: '#00FF00',
      color: 'black',
      padding: '50px',
      margin: '50px',
      border: '10px solid blue',
      fontSize: '32px',
      fontWeight: 'bold',
      position: 'relative',
      zIndex: 10000
    }}>
      ✅ REACT ULTIMATE TEST IS RENDERING!
      <p>Mounted: {mounted ? 'YES' : 'NO'}</p>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <div style={{ backgroundColor: 'orange', padding: '20px', marginTop: '20px' }}>
        This should be visible NO MATTER WHAT
      </div>
    </div>
  )
}