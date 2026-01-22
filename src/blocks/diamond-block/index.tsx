import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import Edit from './Edit';
import block from './block.json';
import './style.scss';
import { createCSSVariables } from './utils';

registerBlockType( block.name, {
	edit: Edit,
	save: ( { attributes } ) => {
		const blockProps = useBlockProps.save( {
			style: {
				...createCSSVariables( attributes ),
			},
		} );
		const { children, ...innerBlocksProps } = useInnerBlocksProps.save();
		return (
			<div { ...blockProps }>
				<div className="wp-block-cno-diamond-button__diamond" />
				<div
					className="wp-block-cno-diamond-button__content"
					{ ...innerBlocksProps }
				>
					{ children }
				</div>
			</div>
		);
	},
} );
