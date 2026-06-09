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
	 * Constructor
	 *
	 * @param string $dir_path The directory path of the plugin
	 * @param string $dir_url  The directory URL of the plugin
	 */
	public function __construct( string $dir_path, string $dir_url ) {
		$this->dir_path = $dir_path;
		$this->dir_url  = $dir_url;
	}

	public function load_plugin() {
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'add_editor_scripts' ) );
		$rest_router = new Rest_Router();
		add_action( 'rest_api_init', array( $rest_router, 'register_routes' ) );
	}

	/**
	 * Initializes the Plugin
	 *
	 * @return void
	 */
	public function activate(): void {
		// nothing to do here
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
}
