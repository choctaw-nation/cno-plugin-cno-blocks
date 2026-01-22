export default function useSiteColors(): { name: string; color: string }[] {
	const sectionColors = window.siteColors;
	const siteColors = Object.entries( sectionColors ).map( ( [ k, v ] ) => {
		return {
			name: k
				.split( '-' )
				.map(
					( word ) => word.charAt( 0 ).toUpperCase() + word.slice( 1 )
				)
				.join( ' ' ),
			color: v,
		};
	} );
	return siteColors;
}
