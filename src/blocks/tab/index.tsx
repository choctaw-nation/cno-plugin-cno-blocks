/**
 * WordPress dependencies
 */
import { tab as icon } from '@wordpress/icons';
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
	icon,
	edit: Edit,
	save: () => <InnerBlocks.Content />,
} );
