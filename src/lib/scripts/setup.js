import fs from "fs"
import readline from "readline"
import crypto from "crypto"
import path from "path"
import { fileURLToPath } from "url"

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to generate random secrets
function generateSecrets() {
	// Generate a random hex string
	const generateSecret = () => crypto.randomBytes(32).toString("hex")

	// Paths
	const rootDir = path.resolve(__dirname, "../../../")
	const envPath = path.join(rootDir, ".env")
	const envExamplePath = path.join(rootDir, ".env.example")

	// Only proceed if .env doesn't exist but .env.example does
	if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
		console.log("🔑 Creating .env file with generated secrets...")

		// Read the example file
		let envContent = fs.readFileSync(envExamplePath, "utf8")

		// Replace placeholder secrets with generated values
		envContent = envContent.replace("PAYLOAD_SECRET=YOUR_SECRET_HERE", `PAYLOAD_SECRET=${generateSecret()}`)
		envContent = envContent.replace("CRON_SECRET=YOUR_CRON_SECRET_HERE", `CRON_SECRET=${generateSecret()}`)

		// Write to .env file
		fs.writeFileSync(envPath, envContent)
		console.log("✅ Environment file created successfully")
	} else {
		if (fs.existsSync(envPath)) {
			console.log("⚠️ .env file already exists, skipping secret generation")
		} else {
			console.error("❌ .env.example file not found")
		}
	}
}

// Function to check if DATABASE_URI already exists and is not empty
function checkDatabaseURI() {
	const rootDir = path.resolve(__dirname, "../../../")
	const envPath = path.join(rootDir, ".env")

	if (fs.existsSync(envPath)) {
		const envContent = fs.readFileSync(envPath, "utf8")
		const match = envContent.match(/DATABASE_URI="([^"]*)"/)

		if (match && match[1] && match[1].trim() !== "") {
			console.log("✅ Database URI already exists in .env, skipping prompt")
			return true
		}
	}

	return false
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

// First generate secrets
console.log("Starting setup process...")
generateSecrets()

// Check if we need to ask for DATABASE_URI
if (checkDatabaseURI()) {
	console.log("🚀 Setup complete!")
	rl.close()
} else {
	// Then ask for MongoDB connection string
	rl.question("Enter your MongoDB connection string: ", (dbString) => {
		// Update or add the database string to .env
		const envPath = path.resolve(__dirname, "../../../.env")

		// Check if .env exists
		if (fs.existsSync(envPath)) {
			let envContent = fs.readFileSync(envPath, "utf8")

			// Check if DATABASE_URI already exists in the file
			if (envContent.includes("DATABASE_URI=")) {
				// Replace existing DATABASE_URI
				envContent = envContent.replace(/DATABASE_URI=.*(\r?\n|$)/g, `DATABASE_URI="${dbString}"$1`)
			} else {
				// Append DATABASE_URI to the end
				envContent += `\nDATABASE_URI="${dbString}"\n`
			}

			// Write updated content back to .env
			fs.writeFileSync(envPath, envContent)
		} else {
			// Create new .env file with just the DB string if it doesn't exist
			fs.writeFileSync(envPath, `DATABASE_URI="${dbString}"\n`)
		}

		console.log("✅ Database string saved in .env")
		console.log("🚀 Setup complete!")
		rl.close()
	})
}
