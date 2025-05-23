import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 16,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'blue',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 'bold',
          borderRadius: '50%', // ทำให้เป็นวงกลม
        
          textAlign: 'center', // จัดข้อความให้อยู่กลาง
          lineHeight: '32px', // ให้ข้อความอยู่กลางในแนวตั้ง
        }}
      >
        BG
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}
