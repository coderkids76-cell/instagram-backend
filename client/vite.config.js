import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// هذا الملف يربط الواجهة بالسيرفر الخلفي
export default defineConfig({
  plugins: [react()],
    server: {
        proxy: {
              "/api": {
                      target: "http://localhost:3000",
                              changeOrigin: true,
                                      secure: false,
                                            },
                                                },
                                                  },
                                                  })
                                                  