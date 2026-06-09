/**
 * Parse a WP CSS value string (e.g. `var:preset|spacing|sm`) into a valid CSS value (e.g. `var(--wp--preset--spacing--sm)`)
 * @param value WP var string (e.g. `var:preset|spacing|sm)
 * @return Parsed CSS value (e.g. `var(--wp--preset--spacing--sm)`) or the original value if it doesn't match the expected format
 */
export function parseWpCssValue( value ) {
	if ( ! value || typeof value !== 'string' ) {
		return undefined;
	}

	if ( value.startsWith( 'var:preset|' ) ) {
		return `var(--wp--preset--${ value
			.replace( 'var:preset|', '' )
			.replaceAll( '|', '--' ) })`;
	}

	return value;
}
