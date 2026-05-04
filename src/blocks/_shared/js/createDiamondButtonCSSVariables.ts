import { CSSProperties } from 'react';

export function createCSSVariables( {
	btnColor,
	btnColorHSL,
	btnBgColor,
}: {
	btnColor: string;
	btnColorHSL: { h: number | null; s: number | null; l: number | null };
	btnBgColor: string;
} ): CSSProperties {
	const style = {
		'--btn-color': btnColor,
		'--btn-bg-color': btnBgColor,
	} as CSSProperties;

	if ( Object.values( btnColorHSL ).every( ( v ) => v !== null ) ) {
		const hsl = Object.entries( btnColorHSL ).reduce(
			( vars, [ key, value ] ) => {
				if ( key !== 'h' ) {
					vars[ `--btn-color--${ key }` ] = `${ value }%`;
				} else {
					vars[ `--btn-color--${ key }` ] = value;
				}
				return vars;
			},
			{}
		);
		return {
			...style,
			...hsl,
		} as CSSProperties;
	}
	return style;
}
