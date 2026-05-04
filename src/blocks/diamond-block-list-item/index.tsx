import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import Edit from './Edit';
import block from './block.json';
import './style.scss';

registerBlockType( block.name, {
	edit: Edit,
	save: () => {
		const blockProps = useBlockProps.save();
		const { children, ...innerBlocksProps } = useInnerBlocksProps.save( {
			className: 'wp-block-cno-diamond-button-list-item__content',
		} );
		return (
			<li { ...blockProps }>
				<div className="wp-block-cno-diamond-button-list-item__diamond" />
				<div { ...innerBlocksProps }>{ children }</div>
			</li>
		);
	},
} );
