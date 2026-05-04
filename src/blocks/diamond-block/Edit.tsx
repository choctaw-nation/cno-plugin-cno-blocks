import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { PanelBody, ColorPalette } from '@wordpress/components';
import { createCSSVariables } from '@shared/js/createDiamondButtonCSSVariables';
import { hexToHsl } from '@shared/js/hexToHsl';
import useSiteColors from '../_shared/hooks/useSiteColors';

export default function Edit( props ) {
	const { attributes, setAttributes } = props;
	const { btnColor, btnBgColor } = attributes;
	const colors = useSiteColors();
	const blockProps = useBlockProps( {
		style: createCSSVariables( attributes ),
	} );

	const { children, ...innerBlocksProps } = useInnerBlocksProps( {
		className: 'wp-block-cno-diamond-button__content',
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
			<div { ...blockProps }>
				<div className="wp-block-cno-diamond-button__diamond" />
				<div { ...innerBlocksProps }>{ children }</div>
			</div>
		</Fragment>
	);
}
