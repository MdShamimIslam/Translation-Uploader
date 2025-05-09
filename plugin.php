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
        add_action('wp_ajax_ftl_handle_file_upload', [$this, 'ftl_handle_file_upload']);
        add_action('wp_ajax_nopriv_ftl_handle_file_upload', [$this, 'ftl_handle_file_upload']);
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

    public function ftl_admin_enqueue_scripts($hook){ 
        if ( is_admin() && $hook !== 'toplevel_page_translation-uploader') return;
        
        // Enqueue SweetAlert2
        wp_enqueue_style('sweetalert2', 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.min.css');
        wp_enqueue_script('sweetalert2', 'https://cdn.jsdelivr.net/npm/sweetalert2@11.7.32/dist/sweetalert2.all.min.js', [], '11.7.32', true);
        
        // Enqueues Translation uploader js and css
        wp_enqueue_script( 'translation-uploader-js', FTL_DIR_URL . 'build/index.js', ['wp-element', 'sweetalert2'], FTL_VERSION, true );
        wp_enqueue_style( 'translation-uploader-css', FTL_DIR_URL . 'build/main.css', ['sweetalert2'], FTL_VERSION );
        
        // Add WordPress ajax URL to be available in JS
        wp_localize_script('translation-uploader-js', 'translationUploaderAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('translation_uploader_nonce')
        ));
    
    }

    public function translation_uploader_page() {
        echo '<div class="wrap">';
        // Show welcome message when page loads
        echo '<script>
            document.addEventListener("DOMContentLoaded", function() {
                Swal.fire({
                    title: "Welcome",
                    html: "<h3 style=\'font-size: 1.2em; margin: 10px 0;\'>Translation Uploader</h3>Use shortcode <strong>[translation_uploader]</strong> to display on any page",                    icon: "info",
                    confirmButtonText: "Got it!",
                    confirmButtonColor: "#3085d6"
                });
            });
        </script>';
        echo '<style>
            .wrap {
                max-width: 900px;
                margin: 0 auto;
                padding: 40px;
            }
            #translation-uploader-root {
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                .sourceLan{
                    width: 420px;
                    label{
                        display: block;
                        margin: 10px 0;
                    }
                }
            }
        </style>';
        echo '<div id="translation-uploader-root"></div>';
        echo '</div>';
    }

    public function ftl_translation_uploader_shortcode() {
        ob_start();
        echo '<div id="translation-uploader-root"></div>';
        return ob_get_clean();
    }

    public function ftl_handle_file_upload() {
        if (!function_exists('wp_handle_upload')) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
        }
        if (!function_exists('wp_generate_attachment_metadata')) {
            require_once(ABSPATH . 'wp-admin/includes/image.php');
        }
        if (!function_exists('media_handle_upload')) {
            require_once(ABSPATH . 'wp-admin/includes/media.php');
        }

        $file = $_FILES['file'];
        $upload_overrides = array('test_form' => false);
        
        // Upload the file
        $movefile = wp_handle_upload($file, $upload_overrides);
        
        if ($movefile && !isset($movefile['error'])) {
            // Prepare attachment data
            $attachment = array(
                'post_mime_type' => $movefile['type'],
                'post_title' => sanitize_file_name($file['name']),
                'post_content' => '',
                'post_status' => 'inherit'
            );

            // Insert attachment
            $attach_id = wp_insert_attachment($attachment, $movefile['file']);
            
            // Generate metadata
            $attach_data = wp_generate_attachment_metadata($attach_id, $movefile['file']);
            wp_update_attachment_metadata($attach_id, $attach_data);

            wp_send_json_success([
                'message' => 'File uploaded successfully',
                'attachment_id' => $attach_id,
                'url' => $movefile['url']
            ]);
        } else {
            wp_send_json_error(['message' => $movefile['error']]);
        }
    }
 }
 
 Translation_Uploader::get_instance();



