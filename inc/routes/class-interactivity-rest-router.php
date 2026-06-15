<?php
/**
 * Interactivity Blocks Rest Router
 *
 * @package ChoctawNation
 * @subpackage CNO_Blocks
 */

namespace ChoctawNation\CNO_Blocks\Routes;

use ChoctawNation\CNO_Blocks\Jobs\Gravity_Forms_Parser;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/** Handles REST API routes for Interactivity Blocks */
class Interactivity_Rest_Router extends WP_REST_Controller {
	/**
	 * Registers the routes for the REST API
	 *
	 * @return void
	 */
	public function register_routes(): void {
		$namespace = 'cno-interactivity/v1';

		register_rest_route(
			$namespace,
			'/cnhsa-guidelines',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_cnhsa_guidelines' ),
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			$namespace,
			'/forms/(?P<form_id>\d+)',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_form_fields' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Retrieves the CNHSA Guidelines content
	 *
	 * @return WP_REST_Response
	 */
	public function get_cnhsa_guidelines(): WP_REST_Response {
		$transient_key   = 'cno_cnhsa_guidelines';
		$guidelines_html = get_transient( $transient_key );
		if ( false === $guidelines_html ) {
			$guidelines_html = acf_esc_html( get_field( 'cnhsa_guidelines', 'options' ) );
			set_transient( $transient_key, $guidelines_html, DAY_IN_SECONDS );
		}
		return new WP_REST_Response( array( 'html' => $guidelines_html ) );
	}

	/**
	 * Retrieves the fields for a given Gravity Form
	 *
	 * @param WP_REST_Request $request The REST request object containing the form ID parameter
	 * @return WP_REST_Response The response containing the form fields or an error message
	 */
	public function get_form_fields( WP_REST_Request $request ): WP_REST_Response {
		if ( ! class_exists( '\GFAPI' ) ) {
			return new WP_REST_Response( array( 'error' => 'Gravity Forms API not available' ), 500 );
		}
		$form_id   = absint( $request['form_id'] );
		$cache_key = 'gf_renderer_form_' . $form_id;
		$data      = get_transient( $cache_key );
		if ( false !== $data ) {
			return new WP_REST_Response( $data, 200, array( 'Cache-Control' => 'public, max-age=3600' ) );
		}

		try {
			$form = \GFAPI::get_form( $form_id );
			if ( ! $form ) {
				return new WP_REST_Response( array( 'error' => 'Form not found' ), 404 );
			}
			$data = Gravity_Forms_Parser::parse( $form );
			set_transient( $cache_key, $data, HOUR_IN_SECONDS );

			return new WP_REST_Response( $data, 200, array( 'Cache-Control' => 'public, max-age=3600' ) );
		} catch ( \Exception $e ) {
			return new WP_REST_Response( array( 'error' => 'Error retrieving form: ' . $e->getMessage() ), 500 );
		}
	}
}