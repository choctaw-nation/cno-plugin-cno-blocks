import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';

export function useCurrentPostSiblings() {
	return useSelect( ( select ) => {
		const editor = select( editorStore );
		const coreData = select( coreDataStore );

		const postId = editor.getCurrentPostId();
		const postType = editor.getCurrentPostType();

		const currentPost = coreData.getEntityRecord(
			'postType',
			postType,
			postId
		);

		const parentId = currentPost?.parent || postId;

		const parentPost = coreData.getEntityRecord(
			'postType',
			postType,
			parentId
		);

		const childrenQuery = {
			parent: parentId,
			per_page: -1,
			orderby: 'menu_order',
			order: 'asc',
		};

		const childPosts = coreData.getEntityRecords(
			'postType',
			postType,
			childrenQuery
		);

		const isResolvingCurrentPost = coreData.isResolving(
			'getEntityRecord',
			[ 'postType', postType, postId ]
		);

		const isResolvingParentPost = coreData.isResolving( 'getEntityRecord', [
			'postType',
			postType,
			parentId,
		] );

		const isResolvingChildren = coreData.isResolving( 'getEntityRecords', [
			'postType',
			postType,
			childrenQuery,
		] );

		return {
			parentTitle: parentPost?.title?.rendered ?? null,
			parentIsActive: parentId === postId,
			children: Array.isArray( childPosts )
				? childPosts.map( ( child ) => ( {
						title: child.title?.rendered ?? '',
						isActive: child.id === postId,
				  } ) )
				: null,
			isResolving:
				isResolvingCurrentPost ||
				isResolvingParentPost ||
				isResolvingChildren,
		};
	}, [] );
}
