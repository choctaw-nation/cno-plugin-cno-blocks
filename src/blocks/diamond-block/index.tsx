import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import Edit from './Edit';
import block from './block.json';
import './style.scss';
import { createCSSVariables } from '@shared/js/createDiamondButtonCSSVariables';

registerBlockType( block.name, {
	edit: Edit,
	save: ( { attributes } ) => {
		const blockProps = useBlockProps.save( {
			style: {
				...createCSSVariables( attributes ),
			},
		} );
		const { children, ...innerBlocksProps } = useInnerBlocksProps.save( {
			className: 'wp-block-cno-diamond-button__content',
		} );
		return (
			<div { ...blockProps }>
				<div className="wp-block-cno-diamond-button__diamond" />
				<div { ...innerBlocksProps }>{ children }</div>
			</div>
		);
	},
} );
