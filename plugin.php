<?php
/**
 * Plugin Name: Translation Uploader
 * Description: Upload and count words for translation.
 * Version: 1.0.0
 * Author: Md. Shamim Islam
 * Author URL: https://shamim-v0.netlify.app
 */

defined('ABSPATH') || exit;

define( 'FTL_VERSION', isset( $_SERVER['HTTP_HOST'] ) && 'localhost' === $_SERVER['HTTP_HOST'] ? time() : '1.0.0' );
define( 'FTL_DIR_URL', plugin_dir_url( __FILE__ ) );
define( 'FTL_DIR_PATH', plugin_dir_path( __FILE__ ) );

class Translation_Uploader{
    private static $instance;
 
    private function __construct(){
        register_activation_hook(__FILE__, [$this, 'ftl_plugin_activation']);
        add_action('admin_init', [$this, 'ftl_plugin_redirect']);
        add_action('admin_menu', [$this, 'ftl_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'ftl_admin_enqueue_scripts']);
        add_action('wp_enqueue_scripts', [$this, 'ftl_admin_enqueue_scripts']);
        add_shortcode('translation_uploader', [$this, 'ftl_translation_uploader_shortcode']);
    }

    public static function get_instance(){
        if(self::$instance){
           return self::$instance;
        }
  
        self::$instance = new self();
  
        return self::$instance;
    }

    public function ftl_plugin_activation() {
        add_option('activated_plugin', true);
    }

    public function ftl_plugin_redirect() {
        if (get_option('activated_plugin', false)) {
            delete_option('activated_plugin');
            wp_safe_redirect(admin_url('admin.php?page=translation-uploader'));
            exit;
        }
       
    }

    public function ftl_admin_menu() {
        add_menu_page(
            'Translation Uploader',
            'Translation Uploader',
            'manage_options',
            'translation-uploader',
            [$this,'translation_uploader_page'],
            'dashicons-upload',
            6
        );
    }

    public function translation_uploader_page() {
        echo '<div id="translation-uploader-root"></div>';
    }

    public function ftl_admin_enqueue_scripts($hook){ 
        if ( is_admin() && $hook !== 'toplevel_page_translation-uploader') return;
        wp_enqueue_script( 'translation-uploader-js', FTL_DIR_URL . 'build/index.js', ['wp-element'], FTL_VERSION, true );
        wp_enqueue_style( 'translation-uploader-css', FTL_DIR_URL . 'build/main.css', [], FTL_VERSION );
    }

    public function ftl_translation_uploader_shortcode() {
        ob_start();
        echo '<div id="translation-uploader-root"></div>';
        return ob_get_clean();
    }
 }
 
 Translation_Uploader::get_instance();



