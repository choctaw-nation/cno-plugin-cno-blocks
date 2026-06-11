/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { tabList as icon } from '@wordpress/icons';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Edit from './Edit';
import metadata from './block.json';
import './style.scss';

const { name } = metadata;

registerBlockType( name, {
	icon,
	edit: Edit,
	save: () => {
		const blockProps = useBlockProps.save( {
			role: 'tablist',
		} );
		const innerBlocksProps = useInnerBlocksProps.save( blockProps );
		return <div { ...innerBlocksProps } />;
	},
} );
