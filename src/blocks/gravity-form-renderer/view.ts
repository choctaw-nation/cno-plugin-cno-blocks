import {
	store,
	getContext,
	withSyncEvent,
	withScope,
} from '@wordpress/interactivity';
import { GRAVITY_FORMS_RENDERER_STORE, MODAL_STORE } from '@shared/consts';
import { gformHelpers } from './_store/callbacks';
import { GravityFormsContext } from './_store/types';
import { getFieldName, getNameInputName } from './_store/_utils';

const { state: modalState } = store( MODAL_STORE ) as {
	state: {
		isModalOpen?: boolean;
	};
};

const { state, actions } = store( GRAVITY_FORMS_RENDERER_STORE, {
	state: {
		get formIsHidden() {
			const context = getContext< GravityFormsContext >();
			return (
				context.isLoading ||
				context.hasError ||
				context.isSubmitted ||
				state.isLoading
			);
		},
		get hideLoadingState() {
			const context = getContext< GravityFormsContext >();
			return ! context.isLoading;
		},
		get hideErrorMessage() {
			const context = getContext< GravityFormsContext >();
			return ! context.hasError;
		},
		isLoading: false,
	},
	actions: {
		resetForm( keepValues = false ) {
			const context = getContext< GravityFormsContext >();
			context.isSubmitted = false;
			context.confirmationMessage = '';
			context.hasError = false;
			context.isLoading = false;
			context.errorMessage = '';
			context.errors = {};
			if ( ! keepValues ) {
				context.values = getInitialValuesFromPrefilled(
					context.form,
					context.prefilledValues
				);
			}
		},
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
			state.isLoading = true;
			const context = getContext< GravityFormsContext >();
			try {
				const errors = validateForm( context.form, context.values );
				context.errors = errors;
				if ( Object.keys( errors ).length > 0 ) {
					return;
				}
				const payload: Record< string, string > = {};

				for ( const [ inputName, value ] of Object.entries(
					context.values
				) ) {
					payload[ inputName ] = String( value ?? '' );
				}

				const recaptchaToken = yield getRecaptchaToken( context.form );

				if ( ! recaptchaToken ) {
					context.hasError = true;
					context.errorMessage =
						'reCAPTCHA verification failed. Please try again.';
					return;
				}

				if ( recaptchaToken && context.form.recaptcha?.inputName ) {
					payload[ context.form.recaptcha.inputName ] =
						recaptchaToken;
				}

				const response = yield fetch(
					`/wp-json/gf/v2/forms/${ context.formId }/submissions`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify( payload ),
					}
				);

				if ( ! response.ok ) {
					context.hasError = true;
					const data = yield response.json();
					context.errorMessage = `Unable to submit form. ${ Object.values(
						data.validation_messages
					)
						.map( ( message ) => message )
						.join( ', ' ) } Your form will return in ${
						context.resetTimer
					} seconds.`;
					setTimeout(
						withScope( () => {
							actions.resetForm( true );
						} ),
						context.resetTimer * 1000
					);
					return;
				}

				const confirmation = getDefaultConfirmation( context.form );

				context.isSubmitted = true;
				context.confirmationMessage =
					confirmation?.message ||
					'Yakoke (thank you) for contacting us! We will get in touch with you shortly.';
				if ( context.closeOnSubmit ) {
					setTimeout(
						withScope( () => {
							modalState.isModalOpen = false;
							if ( context.resetOnClose === 'always' ) {
								actions.resetForm();
							}
						} ),
						context.closeModalOnSubmitDelay * 1000
					);
				}
				if ( context.resetOnClose === 'onlyAfterSuccessfulSubmit' ) {
					setTimeout(
						withScope( () => {
							actions.resetForm();
						} ),
						context.resetTimer * 1000
					);
				}
			} finally {
				state.isLoading = false;
			}
		} ),
	},

	callbacks: {
		async loadForm() {
			if ( modalState.source !== 'innerblocks' ) {
				return;
			}
			const context = getContext< GravityFormsContext >();
			if ( ! modalState.isModalOpen ) {
				if ( context.resetOnClose === 'always' ) {
					actions.resetForm();
				}
				return;
			}

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
				context.values = getInitialValuesFromPrefilled(
					context.form,
					context.prefilledValues
				);
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

function getPrefilledValue(
	prefilledValues: Record< string, string >,
	ids: Array< string | number >
) {
	for ( const id of ids ) {
		const value = prefilledValues?.[ `prefill_${ id }` ];

		if ( value !== undefined && value !== null && value !== '' ) {
			return value;
		}
	}

	return undefined;
}

function getInitialValuesFromPrefilled(
	form,
	prefilledValues: Record< string, string >
) {
	if ( ! form?.fields?.length || ! prefilledValues ) {
		return {};
	}

	const values: Record< string, string > = {};

	form.fields.forEach( ( field ) => {
		if ( field.type === 'name' && Array.isArray( field.inputs ) ) {
			field.inputs.forEach( ( input ) => {
				const prefilledValue = getPrefilledValue( prefilledValues, [
					input.id,
					field.id,
				] );

				if ( prefilledValue !== undefined ) {
					values[ getNameInputName( input ) ] = prefilledValue;
				}
			} );

			return;
		}

		const prefilledValue = getPrefilledValue( prefilledValues, [
			field.id,
		] );

		if ( prefilledValue !== undefined ) {
			values[ getFieldName( field ) ] = prefilledValue;
		}
	} );

	return values;
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

function getDefaultConfirmation( form ): { message?: string } | null {
	if ( ! form.confirmations ) {
		return null;
	}

	return (
		Object.values(
			form.confirmations as Record<
				string,
				{ isDefault?: boolean; message?: string }
			>
		).find( ( confirmation ) => confirmation.isDefault ) || null
	);
}

async function getRecaptchaToken(
	form: GravityForm
): Promise< string | null > {
	if ( ! form.recaptcha?.siteKey || ! form.recaptcha?.inputName ) {
		throw new Error( 'reCAPTCHA site key or input name is missing.' );
	}

	if ( ! window.grecaptcha ) {
		throw new Error( 'reCAPTCHA is not available.' );
	}

	return new Promise( ( resolve, reject ) => {
		window.grecaptcha.ready( () => {
			window.grecaptcha
				.execute( form.recaptcha!.siteKey, {
					action: form.recaptcha!.action || 'gravityforms_submit',
				} )
				.then( resolve )
				.catch( reject );
		} );
	} );
}
