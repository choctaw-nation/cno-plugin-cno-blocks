export type GravityFormsContext = {
	formId: number;
	form: any | null;
	values: Record< string, any >;
	errors: Record< string, string >;
	isLoading: boolean;
	hasError: boolean;
	errorMessage: string;
	isSubmitted: boolean;
	confirmationMessage: string;
};
