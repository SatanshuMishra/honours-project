declare namespace NodeJS {
	interface ProcessEnv extends NodeJS.Dict<string> {
		readonly DATABASE_URL: string
		readonly NEXT_PUBLIC_NUMBER_OF_QUESTIONS: string
		readonly NEXT_PUBLIC_BONUS_REQUIREMENT: string
		readonly NEXT_PUBLIC_BASE_URL: string
		readonly JWT_SECRET: string
		readonly PASSWORD_ENCRYPTION_KEY: string
	}
}

export { }

