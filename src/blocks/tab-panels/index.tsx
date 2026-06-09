/**
 * WordPress dependencies
 */
import { contents as icon } from '@wordpress/icons';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Edit from './Edit';
import metadata from './block.json';
import './style.scss';

const { name } = metadata;

export { metadata, name };
registerBlockType( name, {
	icon,
	edit: Edit,
	save: () => {
		const blockProps = useBlockProps.save();
		const innerBlocksProps = useInnerBlocksProps.save( blockProps );
		return <div { ...innerBlocksProps } />;
	},
} );
