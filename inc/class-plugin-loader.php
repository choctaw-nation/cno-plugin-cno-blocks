<?php
/**
 * Plugin Loader
 *
 * @package ChoctawNation
 * @subpackage CNO_Blocks
 */

namespace ChoctawNation\CNO_Blocks;

/** Inits the Plugin */
class Plugin_Loader {
	/**
	 * The directory path of the plugin
	 *
	 * @var string $dir_path
	 */
	private string $dir_path;

	/**
	 * The directory URL of the plugin
	 *
	 * @var string $dir_url
	 */
	private string $dir_url;

	/**
	 * Plugin Settings instance
	 *
	 * @var WP\Plugin_Settings $settings
	 */
	private WP\Plugin_Settings $settings;

	/**
	 * Constructor
	 *
	 * @param string $dir_path The directory path of the plugin
	 * @param string $dir_url  The directory URL of the plugin
	 */
	public function __construct( string $dir_path, string $dir_url ) {
		$this->dir_path = $dir_path;
		$this->dir_url  = $dir_url;
		$this->settings = new WP\Plugin_Settings();
	}

	/**
	 * Load Plugin
	 */
	public function load_plugin() {
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'add_editor_scripts' ) );
		add_action('wp_enqueue_scripts', array( $this, 'register_frontend_assets' ) );
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
		$this->handle_tabs_blocks();
		$this->add_admin_screen();
	}

	/**
	 * Registers REST API Routes
	 */
	public function register_rest_routes() {
		$i11y_rest_router = new Routes\Interactivity_Rest_Router();
		$i11y_rest_router->register_routes();
		$acf_rest_router = new Routes\ACF_Rest_Router();
		$acf_rest_router->register_routes();
		$admin_rest_router = new Routes\Admin_Rest_Router( $this->dir_path, $this->dir_url, $this->settings );
		$admin_rest_router->register_routes();
	}

	/**
	 * Handle Tabs blocks context
	 *
	 * @return void
	 */
	private function handle_tabs_blocks() {
		$tabs_handler = new CNO_Tabs_Handler();
		add_filter( 'render_block_context', array( $tabs_handler, 'block_cno_tabs_provide_context' ), 10, 2 );
	}

	/**
	 * Initializes the Plugin
	 *
	 * @return void
	 */
	public function activate(): void {
		$this->settings->register();
		$this->settings->initialize_defaults();
	}

	/**
	 * Handles Plugin Deactivation
	 * (this is a callback function for the `register_deactivation_hook` function)
	 *
	 * @return void
	 */
	public function deactivate(): void {
		// nothing to do here
	}

	/**
	 * Register Gutenberg Block
	 */
	public function register_blocks() {
		$blocks_path = $this->dir_path . 'build/blocks';
		/**
		 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
		 * based on the registered block metadata.
		 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
		 *
		 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
		 */
		if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
			wp_register_block_types_from_metadata_collection( $blocks_path, $this->dir_path . 'build/blocks-manifest.php' );
		}
	}

	/**
	 * Load Script to handle Modal Block insertion
	 */
	public function add_editor_scripts() {
		$asset_file = $this->dir_path . 'build/editor/insertModalBlock.asset.php';
		if ( file_exists( $asset_file ) ) {
			$asset = require $asset_file;
			wp_enqueue_script(
				'insert-modal-block-editor-script',
				$this->dir_url . 'build/editor/insertModalBlock.js',
				$asset['dependencies'],
				$asset['version'],
				array( 'strategy' => 'defer' )
			);
		}
	}

	public function register_frontend_assets() {
		$site_key = $this->settings->get_settings('siteKey');
		wp_register_script(
			'cno-i11y-google-recaptcha-v3',
			add_query_arg(
				array(
					'render' => $site_key,
				),
				'https://www.google.com/recaptcha/api.js'
			),
			array(),
			false,
			array( 'strategy' => 'defer' )
		);
	}

	/**
	 * Add Admin Screen for the plugin
	 */
	private function add_admin_screen(): void {
		$admin_screen = new WP\Admin_Screen( $this->dir_path, $this->dir_url );
		add_action( 'admin_menu', array( $admin_screen, 'add_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $admin_screen, 'enqueue_admin_assets' ) );
	}
}