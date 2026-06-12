/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import useServiceLocations from './useServiceLocations';
import './editor.scss';

export default function Edit() {
	const { locations, isLoading } = useServiceLocations();
	const blockProps = useBlockProps( {
		className: locations.length === 1 ? 'single-location' : '',
	} );
	if ( isLoading ) {
		return (
			<div { ...blockProps }>
				<Spinner />
			</div>
		);
	}
	return (
		<ul { ...blockProps }>
			{ locations.map( ( location ) => (
				<li key={ location.id } className="location-card">
					{ location.image && (
						<img src={ location.image } alt={ location.title } />
					) }
					<div className="location-card__body">
						<h3
							className="location-title"
							dangerouslySetInnerHTML={ {
								__html: location.title,
							} }
						/>
						<p
							dangerouslySetInnerHTML={ {
								__html: location.address,
							} }
						/>
						<button type="button" className="directions-button">
							Directions
						</button>
						<button type="button" className="call-button">
							Contact
						</button>
					</div>
				</li>
			) ) }
		</ul>
	);
}
