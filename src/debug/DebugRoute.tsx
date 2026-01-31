export default function DebugRoute() {
  return (
    <div style={{
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '40px',
      margin: '20px',
      borderRadius: '8px',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      ✅ DEBUG COMPONENT IS RENDERING!
      <p style={{ fontSize: '16px', marginTop: '10px' }}>
        URL: {window.location.href}
      </p>
    </div>
  )
}