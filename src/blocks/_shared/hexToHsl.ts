export function hexToHsl( hex?: string ) {
	if ( ! hex ) {
		return { h: null, s: null, l: null };
	}
	hex = hex.replace( /^#/, '' );
	if ( hex.length === 3 ) {
		hex = hex
			.split( '' )
			.map( ( c ) => c + c )
			.join( '' );
	}
	const r = parseInt( hex.slice( 0, 2 ), 16 ) / 255;
	const g = parseInt( hex.slice( 2, 4 ), 16 ) / 255;
	const b = parseInt( hex.slice( 4, 6 ), 16 ) / 255;
	const max = Math.max( r, g, b ),
		min = Math.min( r, g, b );
	let h = 0,
		s = 0;
	const l = ( max + min ) / 2;

	if ( max !== min ) {
		const d = max - min;
		s = l > 0.5 ? d / ( 2 - max - min ) : d / ( max + min );
		switch ( max ) {
			case r:
				h = ( g - b ) / d + ( g < b ? 6 : 0 );
				break;
			case g:
				h = ( b - r ) / d + 2;
				break;
			case b:
				h = ( r - g ) / d + 4;
				break;
		}
		h /= 6;
	}

	return {
		h: Math.round( h * 360 ),
		s: Math.round( s * 100 ),
		l: Math.round( l * 100 ),
	};
}
