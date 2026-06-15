import { store, getContext, withSyncEvent } from '@wordpress/interactivity';
import { GRAVITY_FORMS_RENDERER_STORE, MODAL_STORE } from '@shared/consts';
import { gformHelpers } from './_store/callbacks';
import { GravityFormsContext } from './_store/types';
import { getFieldName, getNameInputName } from './_store/_utils';

const { state: modalState } = store( MODAL_STORE );
store( GRAVITY_FORMS_RENDERER_STORE, {
	state: {
		get formIsHidden() {
			const context = getContext< GravityFormsContext >();
			return context.isLoading || context.hasError || context.isSubmitted;
		},
		get hideLoadingState() {
			const context = getContext< GravityFormsContext >();
			return ! context.isLoading;
		},
		get hideErrorMessage() {
			const context = getContext< GravityFormsContext >();
			return ! context.hasError;
		},
	},
	actions: {
		updateFieldValue( event ) {
			const context = getContext< GravityFormsContext >();
			const field = context.field;
			const name = getFieldName( field );

			context.values[ name ] = event.target.value;

			if ( context.errors[ name ] ) {
				delete context.errors[ name ];
			}
		},
		updateNameInputValue( event ) {
			const context = getContext< GravityFormsContext >();
			const name = getNameInputName( context.input );

			context.values[ name ] = event.target.value;

			if ( context.errors[ name ] ) {
				delete context.errors[ name ];
			}
		},

		submitForm: withSyncEvent( function* ( event ) {
			event.preventDefault();

			const context = getContext< GravityFormsContext >();
			const errors = validateForm( context.form, context.values );
			context.errors = errors;

			if ( Object.keys( errors ).length > 0 ) {
				return;
			}

			const response = yield fetch(
				`/wp-json/gf/v2/forms/${ context.formId }/submissions`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify( context.values ),
				}
			);

			if ( ! response.ok ) {
				context.hasError = true;
				context.errorMessage = 'Unable to submit form.';
				return;
			}

			const confirmation = getDefaultConfirmation( context.form );

			context.isSubmitted = true;
			context.confirmationMessage =
				confirmation?.message ||
				'Thank you. Your submission has been received.';
		} ),
	},

	callbacks: {
		async loadForm() {
			if ( ! modalState.isModalOpen ) {
				return;
			}
			const context = getContext< GravityFormsContext >();

			if ( ! context.formId ) {
				context.isLoading = false;
				context.hasError = true;
				context.errorMessage = 'Missing form ID.';
				return;
			}

			try {
				const response = await fetch(
					`/wp-json/cno-interactivity/v1/forms/${ context.formId }`
				);

				if ( ! response.ok ) {
					throw new Error( 'Unable to load form.' );
				}

				const form = await response.json();

				context.form = normalizeForm( form );
				context.values = {};
				context.errors = {};
				context.isLoading = false;
			} catch ( error ) {
				context.isLoading = false;
				context.hasError = true;
				context.errorMessage = `Unable to load form. ${ error }`;
			}
		},
		...gformHelpers,
	},
} );

function normalizeForm( form ) {
	return {
		...form,
		fields: Array.isArray( form.fields )
			? form.fields.map( ( field ) => ( {
					...field,
					isRequired:
						field.isRequired === true || field.isRequired === '1',
					maxLength: field.maxLength
						? Number( field.maxLength )
						: undefined,
			  } ) )
			: [],
	};
}

function validateForm( form, values ) {
	const errors = {};

	form.fields.forEach( ( field ) => {
		if ( ! field.isRequired || field.visibility === 'hidden' ) {
			return;
		}

		if ( field.type === 'name' && Array.isArray( field.inputs ) ) {
			field.inputs.forEach( ( input ) => {
				if ( input.isHidden ) {
					return;
				}

				const name = getNameInputName( input );

				if ( ! values[ name ] ) {
					errors[
						name
					] = `${ field.label } ${ input.label } is required.`;
				}
			} );

			return;
		}

		const name = getFieldName( field );

		if ( ! values[ name ] ) {
			errors[ name ] =
				field.errorMessage || `${ field.label } is required.`;
		}
	} );

	return errors;
}

function getDefaultConfirmation( form ) {
	if ( ! form.confirmations ) {
		return null;
	}

	return Object.values( form.confirmations ).find(
		( confirmation ) => confirmation.isDefault
	);
}
