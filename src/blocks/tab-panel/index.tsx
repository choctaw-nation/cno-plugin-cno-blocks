/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { tabPanel as icon } from '@wordpress/icons';
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
	save: ( { attributes } ) => {
		const blockProps = useBlockProps.save( {
			role: 'tabpanel',
			'data-tab-panel-index': attributes.index ?? undefined,
			'data-wp-bind--hidden': '!state.isActiveTabPanel',
			'data-wp-bind--aria-labelledby': 'callbacks.getTabAriaLabelledBy',
			tabindex: '0',
		} );
		const innerBlocksProps = useInnerBlocksProps.save( blockProps );

		return <section { ...innerBlocksProps } />;
	},
} );
