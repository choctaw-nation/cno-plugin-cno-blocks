import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { PanelBody, ColorPalette } from '@wordpress/components';
import { hexToHsl } from '@shared/js/hexToHsl';
import { createCSSVariables } from '@shared/js/createDiamondButtonCSSVariables';
import useSiteColors from '@shared/hooks/useSiteColors';
import { parseWpCssValue } from '@shared/js/parseWpCssValue';

const CHILD_BLOCK = 'cno/diamond-button-list-item';

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { btnColor, btnBgColor } = attributes;
	const colors = useSiteColors();
	const ListElement = attributes.listType === 'unordered' ? 'ul' : 'ol';
	const blockProps = useBlockProps.save( {
		style: {
			listStyleType: 'none',
			...createCSSVariables( attributes ),
			display: 'flex',
			flexDirection: 'column',
			gap: attributes?.style?.spacing?.blockGap
				? parseWpCssValue( attributes?.style?.spacing?.blockGap )
				: undefined,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ CHILD_BLOCK ],
		template: [ [ CHILD_BLOCK ], [ CHILD_BLOCK ] ],
	} );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
					<div
						style={ {
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
						} }
					>
						<div>
							<h2>Button Color</h2>
							<ColorPalette
								clearable={ false }
								disableCustomColors={ true }
								value={ btnColor }
								onChange={ ( color ) => {
									const hsl = hexToHsl( color );
									setAttributes( {
										btnColor: color,
										btnColorHSL: hsl,
									} );
								} }
								colors={ colors }
							/>
						</div>
						<div>
							<h2>Button Background Color</h2>
							<ColorPalette
								clearable={ false }
								disableCustomColors={ true }
								value={ btnBgColor }
								onChange={ ( color ) =>
									setAttributes( { btnBgColor: color } )
								}
								colors={ [
									...colors,
									{ name: 'White', color: '#ffffff' },
								] }
							/>
							<p className="components-base-control__help">
								Set the background color of the button to match
								the color of the section to simulate
								transparency.
							</p>
						</div>
					</div>
				</PanelBody>
			</InspectorControls>
			<ListElement { ...innerBlocksProps } />
		</Fragment>
	);
}
