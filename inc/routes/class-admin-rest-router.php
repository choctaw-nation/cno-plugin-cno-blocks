<?php
/**
 * Admin Rest Router
 *
 * @package ChoctawNation
 */

namespace ChoctawNation\CNO_Blocks\Routes;

use ChoctawNation\CNO_Blocks\WP\Plugin_Settings;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Rest Router
 */
class Admin_Rest_Router extends WP_REST_Controller {
	/**
	 * The plugin directory path
	 *
	 * @var string $dir_path
	 */
	public string $dir_path;

	/**
	 * The plugin directory URL
	 *
	 * @var string $dir_url
	 */
	public string $dir_url;

	/**
	 * Plugin Settings instance
	 *
	 * @var Plugin_Settings $settings
	 */
	private Plugin_Settings $settings;

	/**
	 * Constructor
	 *
	 * @param string          $dir_path The plugin directory path.
	 * @param string          $dir_url The plugin directory URL.
	 * @param Plugin_Settings $settings The plugin settings instance.
	 */
	public function __construct( string $dir_path, string $dir_url, Plugin_Settings $settings ) {
		$this->dir_path = $dir_path;
		$this->dir_url  = $dir_url;
		$this->settings = $settings;
	}

	/**
	 * Register routes
	 */
	public function register_routes(): void {
		$namespace = 'cno-site-blocks/v1';
		register_rest_route(
			$namespace,
			'/settings',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => function () {
					return rest_ensure_response( $this->settings->get_settings() );
				},
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		register_rest_route(
			$namespace,
			'/settings',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'set_settings' ),
				'permission_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
				'args'                => array(
					'siteKey' => array(
						'type'              => 'string',
						'description'       => 'The site key for the plugin.',
						'required'          => false,
						'sanitize_callback' => 'sanitize_text_field',
						'validate_callback' => function ( $param, $request, $key ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
							return ! empty( $param ) && is_string( $param );
						},
					),
				),
			)
		);
	}

	/**
	 * Set settings
	 *
	 * @param WP_REST_Request $request The REST request object.
	 * @return WP_REST_Response The REST response object.
	 */
	public function set_settings( WP_REST_Request $request ): WP_REST_Response {
		$body     = $request->get_json_params();
		$settings = array( 'siteKey' => $body['siteKey'] );
		$this->settings->set_settings( $settings );
		return rest_ensure_response( $settings );
	}
}
