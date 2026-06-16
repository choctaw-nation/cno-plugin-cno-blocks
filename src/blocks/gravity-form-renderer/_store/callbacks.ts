import { getContext } from '@wordpress/interactivity';
import { GravityFormsContext } from './types';
import { getFieldName, getNameInputName } from './_utils';

function getPrefilledValue(
	prefilledValues: Record< string, string >,
	ids: Array< string | number >
) {
	for ( const id of ids ) {
		const value = prefilledValues?.[ `preFill_${ id }` ];

		if ( value !== undefined && value !== null && value !== '' ) {
			return value;
		}
	}

	return '';
}

export const gformHelpers = {
	isNameField() {
		return getContext< GravityFormsContext >().field.type === 'name';
	},

	isHiddenField() {
		return (
			getContext< GravityFormsContext >().field.visibility !== 'visible'
		);
	},

	isHiddenInput() {
		return Boolean( getContext< GravityFormsContext >().input?.isHidden );
	},

	nameInputId() {
		const context = getContext< GravityFormsContext >();

		return `gravity-field-${ context.formId }-${ context.input.id.replace(
			'.',
			'-'
		) }`;
	},

	nameInputName() {
		const context = getContext< GravityFormsContext >();

		return getNameInputName( context.input );
	},

	nameInputValue() {
		const context = getContext< GravityFormsContext >();
		const inputName = getNameInputName( context.input );

		if ( context.values[ inputName ] !== undefined ) {
			return context.values[ inputName ];
		}

		return getPrefilledValue( context.prefilledValues, [
			context.input.id,
			context.field.id,
		] );
	},

	prefilledNameInputValue() {
		return gformHelpers.nameInputValue();
	},

	nameInputAutocomplete() {
		const context = getContext< GravityFormsContext >();

		return context.input.autocompleteAttribute || undefined;
	},

	nameInputErrorId() {
		const context = getContext< GravityFormsContext >();

		return `gravity-field-${ context.formId }-${ context.input.id.replace(
			'.',
			'-'
		) }-error`;
	},

	hasNameInputError() {
		const context = getContext< GravityFormsContext >();

		return Boolean( context.errors[ getNameInputName( context.input ) ] );
	},

	nameInputError() {
		const context = getContext< GravityFormsContext >();

		return context.errors[ getNameInputName( context.input ) ] || '';
	},

	autocompleteValue() {
		const context = getContext< GravityFormsContext >();
		return context.field.autocompleteAttributes;
	},
	fieldName() {
		return getFieldName( getContext< GravityFormsContext >().field );
	},

	fieldInputId() {
		const context = getContext< GravityFormsContext >();

		return `gravity-field-${ context.formId }-${ context.field.id }`;
	},

	fieldErrorId() {
		const context = getContext< GravityFormsContext >();

		return `gravity-field-${ context.formId }-${ context.field.id }-error`;
	},

	fieldValue() {
		const context = getContext< GravityFormsContext >();
		const fieldName = getFieldName( context.field );

		if ( context.values[ fieldName ] !== undefined ) {
			return context.values[ fieldName ];
		}

		return getPrefilledValue( context.prefilledValues, [
			context.field.id,
		] );
	},

	prefilledFieldValue() {
		return gformHelpers.fieldValue();
	},

	fieldError() {
		const context = getContext< GravityFormsContext >();

		return context.errors[ getFieldName( context.field ) ] || '';
	},

	hasFieldError() {
		const context = getContext< GravityFormsContext >();

		return Boolean( context.errors[ getFieldName( context.field ) ] );
	},

	inputType() {
		const field = getContext< GravityFormsContext >().field;

		if ( field.type === 'email' ) {
			return 'email';
		}

		return 'text';
	},
	isStandardInputField() {
		return [
			'text',
			'email',
			'phone',
			'number',
			'website',
			'textarea',
		].includes( getContext< GravityFormsContext >().field.type );
	},

	isTextareaField() {
		return getContext< GravityFormsContext >().field.type === 'textarea';
	},
};
