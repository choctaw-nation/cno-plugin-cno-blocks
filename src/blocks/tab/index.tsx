/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */

import Edit from './Edit';
import './style.scss';
import metadata from './block.json';

const { name } = metadata;

registerBlockType( name, {
	edit: Edit,
	save: () => <InnerBlocks.Content />,
} );
