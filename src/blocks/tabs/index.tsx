/**
 * WordPress dependencies
 */
import { tabs as icon } from '@wordpress/icons';
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Edit from './Edit';
import metadata from './block.json';
import './style.scss';

registerBlockType( metadata.name, {
	icon,
	example: {
		innerBlocks: [
			{
				name: 'cno/tab-list',
				innerBlocks: [
					{
						name: 'cno/tab',
						attributes: { anchor: 'tab-1-button' },
					},
					{
						name: 'cno/tab',
						attributes: { anchor: 'tab-2-button' },
					},
				],
			},
			{
				name: 'cno/tab-panels',
				innerBlocks: [ 1, 2 ].map( ( index ) => ( {
					name: 'cno/tab-panel',
					attributes: {
						anchor: `tab-${ index }`,
						label: `Tab ${ index }`,
					},
					innerBlocks: [
						{
							name: 'core/paragraph',
							attributes: {
								content:
									'In a village of La Mancha, the name of which I have no desire to call to mind, there lived not long since one of those gentlemen that keep a lance in the lance-rack, an old buckler, a lean hack, and a greyhound for coursing.',
							},
						},
					],
				} ) ),
			},
		],
	},
	edit: Edit,
	save: () => {
		const blockProps = useBlockProps.save();
		const innerBlocksProps = useInnerBlocksProps.save( blockProps );

		return <div { ...innerBlocksProps } />;
	},
} );
