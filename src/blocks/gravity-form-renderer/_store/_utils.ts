export function getNameInputName( input ) {
	return `input_${ input.id.replace( '.', '_' ) }`;
}

export function getFieldName( field ) {
	return `input_${ field.id }`;
}
