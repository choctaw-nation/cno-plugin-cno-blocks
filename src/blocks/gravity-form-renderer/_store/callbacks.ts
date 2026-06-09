import { getContext } from '@wordpress/interactivity';
import { GravityFormsContext } from './types';
import { getFieldName, getNameInputName } from './_utils';

export const gformHelpers = {
	isNameField() {
		return getContext< GravityFormsContext >().field.type === 'name';
	},

	isHiddenField() {
		return (
			getContext< GravityFormsContext >().field.visibility === 'hidden'
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

		return context.values[ getNameInputName( context.input ) ] || '';
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

		return context.values[ getFieldName( context.field ) ] || '';
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
