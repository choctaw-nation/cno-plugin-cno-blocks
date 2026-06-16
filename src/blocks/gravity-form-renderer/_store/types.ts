export type GravityFormsContext = {
	formId: number;
	form: any | null;
	field?: any;
	input?: any;
	prefilledValues: Record< string, string >;
	values: Record< string, any >;
	errors: Record< string, string >;
	isLoading: boolean;
	hasError: boolean;
	errorMessage: string;
	isSubmitted: boolean;
	confirmationMessage: string;
};
