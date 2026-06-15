/**
 * WordPress dependencies
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	Spinner,
	Panel,
	PanelBody,
	SelectControl,
} from '@wordpress/components';
import { date } from '@wordpress/date';

/**
 * Internal dependencies
 */
import useRelatedEvents from './useRelatedEvents';
import { calendar } from './icons';

const dateFormats = [
	{ label: 'Jan 01', value: 'M d' },
	{ label: 'Jan 01, 20##', value: 'M d, Y' },
];

export default function Edit( { attributes, setAttributes } ) {
	const { events, isLoading } = useRelatedEvents();
	const blockProps = useBlockProps();
	if ( isLoading ) {
		return (
			<div { ...blockProps }>
				<Spinner />
			</div>
		);
	}
	return (
		<>
			<InspectorControls>
				<Panel>
					<PanelBody>
						<SelectControl
							value={ attributes.dateFormat }
							onChange={ ( value ) => {
								setAttributes( { dateFormat: value } );
							} }
							label="Date Format"
							options={ dateFormats }
						/>
					</PanelBody>
				</Panel>
			</InspectorControls>
			<ol { ...blockProps }>
				{ events.map( ( event ) => (
					<li
						key={ event.id }
						className="wp-block-cno-acf-related-events__event"
					>
						{ event.isVirtual && calendar }
						<span
							className="wp-block-cno-acf-related-events__event-title"
							dangerouslySetInnerHTML={ { __html: event.title } }
						/>
						<time dateTime={ event.startDate }>
							{ date( attributes.dateFormat, event.startDate ) }
						</time>
					</li>
				) ) }
			</ol>
		</>
	);
}
