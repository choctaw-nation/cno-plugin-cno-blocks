import { registerBlockType } from '@wordpress/blocks';
import { list } from '@wordpress/icons';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import Edit from './Edit';
import block from './block.json';
import './style.css';
import { createCSSVariables } from '@shared/js/createDiamondButtonCSSVariables';
import { parseWpCssValue } from '@shared/js/parseWpCssValue';

registerBlockType( block.name, {
	icon: list,
	edit: Edit,
	save: ( props ) => {
		const { attributes } = props;
		const ListElement = attributes.listType === 'unordered' ? 'ul' : 'ol';
		const blockProps = useBlockProps.save( {
			style: {
				listStyleType: 'none',
				...createCSSVariables( attributes ),
				display: 'flex',
				flexDirection: 'column',
				gap: attributes?.style?.spacing?.blockGap
					? parseWpCssValue( attributes?.style?.spacing?.blockGap )
					: undefined,
			},
		} );
		const innerBlocksProps = useInnerBlocksProps.save( blockProps );

		return <ListElement { ...innerBlocksProps } />;
	},
} );
