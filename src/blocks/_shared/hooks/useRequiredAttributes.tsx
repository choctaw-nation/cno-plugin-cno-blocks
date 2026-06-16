import { useEffect, useMemo } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

type AttributeValue =
	| string
	| number
	| boolean
	| unknown[]
	| Record< string, unknown >
	| null
	| undefined;

type Attributes = Record< string, AttributeValue >;

type RequiredField = {
	key: string;
	label: string;
	isValid?: ( value: AttributeValue, attributes: Attributes ) => boolean;
	getValue?: ( attributes: Attributes ) => AttributeValue;
};

type UseRequiredAttributesArgs = {
	attributes: Attributes;
	fields: RequiredField[];
	lockName: string;
};

export default function useRequiredAttributes( {
	attributes,
	fields,
	lockName,
}: UseRequiredAttributesArgs ) {
	const errors = useMemo( () => {
		return fields
			.filter( ( field ) => {
				const value = field.getValue
					? field.getValue( attributes )
					: attributes[ field.key ];

				if ( field.isValid ) {
					return ! field.isValid( value, attributes );
				}

				if ( typeof value === 'string' ) {
					return value.trim() === '';
				}

				if ( Array.isArray( value ) ) {
					return value.length === 0;
				}

				return ! value;
			} )
			.map( ( field ) => `${ field.label } is required.` );
	}, [ attributes, fields ] );

	const isValid = errors.length === 0;
	// console.log( isValid, errors );

	useEffect( () => {
		if ( isValid ) {
			dispatch( editorStore ).unlockPostSaving( lockName );
		} else {
			dispatch( editorStore ).lockPostSaving( lockName );
		}

		return () => {
			dispatch( editorStore ).unlockPostSaving( lockName );
		};
	}, [ isValid, lockName ] );

	return {
		isValid,
		errors,
	};
}
