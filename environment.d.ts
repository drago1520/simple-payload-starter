declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URI: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
    }
  }
} // Add environment variables here to ensure type safety throughout the application

// If this file has no import/export statements (i.e. is a script)
// Convert it into a module by adding an empty export statement.
export { } // Do not delete
