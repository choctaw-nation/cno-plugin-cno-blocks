/**
 * WordPress dependencies
 */
import {
	store,
	getContext,
	getElement,
	withSyncEvent,
} from '@wordpress/interactivity';
type TabsContext = {
	activeTabIndex: number;
	tabsId: string;
	isVertical: boolean;
};
type ServerState = {
	[ key: string ]: Array< {
		id: string;
		label: string;
		index: number;
	} >;
};
const { actions, state } = store( 'cno/tabs', {
	state: {
		/**
		 * Context-aware list of tabs for the current tabs block.
		 * @type {Array}
		 */
		get tabsList() {
			const context = getContext< TabsContext >();
			const tabsId = context?.tabsId;
			return state[ tabsId ] || [];
		},
		/**
		 * Index of the active tab element (label or panel).
		 * @type {number|null}
		 */
		get tabIndex() {
			const { attributes } = getElement();
			const tabId = attributes?.id?.replace( 'tab__', '' ) || null;
			if ( ! tabId ) {
				return null;
			}
			// console.log( 'Finding tab index for tabId:', tabId );
			const tabsList = state.tabsList;
			console.log( 'Current tabsList:', tabsList );
			const tabIndex = tabsList.findIndex( ( t ) => t.id === tabId );
			return tabIndex;
		},
		/**
		 * Whether the current element (label or panel) is the active tab.
		 * @type {boolean}
		 */
		get isActiveTab() {
			const context = getContext< TabsContext >();
			console.log( 'Context in isActiveTab:', context );
			const { activeTabIndex } = context;
			const { tabIndex } = state;
			return activeTabIndex === tabIndex;
		},
		/**
		 * Tabindex attribute for tab buttons.
		 * @type {number}
		 */
		get tabIndexAttribute() {
			return state.isActiveTab ? 0 : -1;
		},
	} as unknown as Partial< ServerState >,
	actions: {
		handleTabKeyDown: withSyncEvent( ( event ) => {
			const context = getContext< TabsContext >();
			const { isVertical } = context;
			const { tabIndex } = state;

			if ( tabIndex === null ) {
				return;
			}

			if ( event.key === 'ArrowRight' && ! isVertical ) {
				event.preventDefault();
				actions.moveFocus( tabIndex + 1 );
			} else if ( event.key === 'ArrowLeft' && ! isVertical ) {
				event.preventDefault();
				actions.moveFocus( tabIndex - 1 );
			} else if ( event.key === 'ArrowDown' && isVertical ) {
				event.preventDefault();
				actions.moveFocus( tabIndex + 1 );
			} else if ( event.key === 'ArrowUp' && isVertical ) {
				event.preventDefault();
				actions.moveFocus( tabIndex - 1 );
			}
		} ),
		handleTabClick: withSyncEvent( ( event ) => {
			event.preventDefault();

			const { tabIndex } = state;
			if ( tabIndex !== null ) {
				actions.setActiveTab( tabIndex );
			}
		} ),
		moveFocus: ( tabIndex ) => {
			const tabsList = state.tabsList;

			if ( ! tabsList || tabsList.length === 0 ) {
				return;
			}

			let newIndex = tabIndex;
			if ( newIndex < 0 ) {
				newIndex = tabsList.length - 1;
			} else if ( newIndex >= tabsList.length ) {
				newIndex = 0;
			}

			const tabId = tabsList[ newIndex ].id;
			const tabElement = document.getElementById( 'tab__' + tabId );
			if ( tabElement ) {
				tabElement.focus();
			}
		},
		setActiveTab: ( tabIndex, scrollToTab = false ) => {
			const tabsList = state.tabsList;

			if ( ! tabsList || tabsList.length === 0 ) {
				return;
			}

			let newIndex = tabIndex;
			if ( newIndex < 0 ) {
				newIndex = 0;
			} else if ( newIndex >= tabsList.length ) {
				newIndex = tabsList.length - 1;
			}

			const context = getContext();
			console.log(
				'Setting active tab index:',
				newIndex,
				'Context before update:',
				context
			);
			context.activeTabIndex = newIndex;

			if ( scrollToTab ) {
				const tabId = tabsList[ newIndex ].id;
				const tabElement = document.getElementById( tabId );
				if ( tabElement ) {
					setTimeout( () => {
						tabElement.scrollIntoView( { behavior: 'smooth' } );
					}, 100 );
				}
			}
		},
	},
	callbacks: {
		onTabsInit: () => {
			const tabsList = state.tabsList;

			if ( ! tabsList || tabsList.length === 0 ) {
				return;
			}

			const { hash } = window.location;
			const tabId = hash.replace( '#', '' );
			const tabIndex = tabsList.findIndex( ( t ) => t.id === tabId );
			if ( tabIndex >= 0 ) {
				actions.setActiveTab( tabIndex, true );
			}
		},
	},
} );
