import fs from "fs"
import readline from "readline"
import crypto from "crypto"
import path from "path"
import { fileURLToPath } from "url"

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "../../../")
const envPath = path.join(rootDir, ".env")
const envExamplePath = path.join(rootDir, ".env.example")

// Generate a random secret
const generateSecret = () => crypto.randomBytes(32).toString("hex")

// Create .env from .env.example if it doesn't exist
function createEnvFromExample() {
	if (fs.existsSync(envPath)) return true

	if (!fs.existsSync(envExamplePath)) {
		console.error("❌ .env.example file not found")
		return false
	}

	// Copy example file to .env
	let exampleContent = fs.readFileSync(envExamplePath, "utf8")

	// Replace placeholders with generated values
	exampleContent = exampleContent.replace(/PAYLOAD_SECRET=.*$/m, `PAYLOAD_SECRET=${generateSecret()}`)

	fs.writeFileSync(envPath, exampleContent)
	console.log("✅ Created .env file from .env.example")
	return true
}

// Simple function to check if DATABASE_URI exists and is not a placeholder
function needsDatabaseURI() {
	if (!fs.existsSync(envPath)) return true

	const envContent = fs.readFileSync(envPath, "utf8")
	const dbLine = envContent.split(/\r?\n/).find((line) => line.trim().startsWith("DATABASE_URI=") && !line.trim().startsWith("#"))

	// Need a new URI if none exists or contains placeholder text
	if (!dbLine) return true
	const value = dbLine.split("=")[1].trim()
	return !value || value.includes("your-database-name")
}

// Simple function to check if PAYLOAD_SECRET exists and is not a placeholder
function needsPayloadSecret() {
	if (!fs.existsSync(envPath)) return true

	const envContent = fs.readFileSync(envPath, "utf8")
	const secretLine = envContent.split(/\r?\n/).find((line) => line.trim().startsWith("PAYLOAD_SECRET=") && !line.trim().startsWith("#"))

	// Need a new secret if none exists or contains placeholder text
	if (!secretLine) return true
	const value = secretLine.split("=")[1].trim()
	return !value || value.includes("YOUR_SECRET_HERE")
}

// Simple function to check if NEXT_PUBLIC_SERVER_URL exists
function needsServerUrl() {
	if (!fs.existsSync(envPath)) return true

	const envContent = fs.readFileSync(envPath, "utf8")
	const urlLine = envContent
		.split(/\r?\n/)
		.find((line) => line.trim().startsWith("NEXT_PUBLIC_SERVER_URL=") && !line.trim().startsWith("#"))

	return !urlLine
}

// Update or add a value to .env file
function updateEnvValue(key, value) {
	let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : ""
	const lines = envContent.split(/\r?\n/)

	const lineIndex = lines.findIndex((line) => line.trim().startsWith(`${key}=`) && !line.trim().startsWith("#"))

	if (lineIndex !== -1) {
		// Replace existing line
		lines[lineIndex] = `${key}=${value}`
		envContent = lines.join("\n")
	} else {
		// Add new line
		envContent += `\n${key}=${value}\n`
	}

	fs.writeFileSync(envPath, envContent)
}

async function main() {
	console.log("🚀 Starting simple setup...")

	// Create readline interface
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	// Create .env from example if needed
	createEnvFromExample()

	// Check and set PAYLOAD_SECRET if needed
	if (needsPayloadSecret()) {
		const secret = generateSecret()
		updateEnvValue("PAYLOAD_SECRET", secret)
		console.log("✅ Generated new PAYLOAD_SECRET")
	}

	// Check and prompt for DATABASE_URI if needed
	if (needsDatabaseURI()) {
		const dbString = await new Promise((resolve) => {
			rl.question("Enter your MongoDB connection string: ", resolve)
		})

		updateEnvValue("DATABASE_URI", dbString)
		console.log("✅ Updated DATABASE_URI")
	} else {
		console.log("✅ Valid DATABASE_URI already exists")
	}

	// Check and set NEXT_PUBLIC_SERVER_URL if needed
	if (needsServerUrl()) {
		updateEnvValue("NEXT_PUBLIC_SERVER_URL", "http://localhost:3000")
		console.log("✅ Added NEXT_PUBLIC_SERVER_URL")
	}

	console.log("🎉 Setup complete!")
	rl.close()
}

// Run the script
main().catch((error) => {
	console.error("❌ Error:", error)
	process.exit(1)
})
