import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	ColorPalette,
	Flex,
	FlexBlock,
} from '@wordpress/components';
import { createCSSVariables, hexToHsl } from './utils';
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
					<Flex direction={ 'column' } gap={ 6 }>
						<FlexBlock>
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
						</FlexBlock>
						<FlexBlock>
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
						</FlexBlock>
					</Flex>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="wp-block-cno-diamond-button__diamond" />
				<div { ...innerBlocksProps }>{ children }</div>
			</div>
		</Fragment>
	);
}
