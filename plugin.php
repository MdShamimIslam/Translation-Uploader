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
        // Add WooCommerce dependency check
        add_action('admin_notices', [$this, 'ftl_check_woocommerce']);
        
        register_activation_hook(__FILE__, [$this, 'ftl_plugin_activation']);
        add_action('admin_init', [$this, 'ftl_plugin_redirect']);
        add_action('admin_menu', [$this, 'ftl_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'ftl_admin_enqueue_scripts']);
        add_action('wp_enqueue_scripts', [$this, 'ftl_admin_enqueue_scripts']);
        add_shortcode('translation_uploader', [$this, 'ftl_translation_uploader_shortcode']);
        add_action('wp_ajax_ftl_handle_file_upload', [$this, 'ftl_handle_file_upload']);
        add_action('wp_ajax_nopriv_ftl_handle_file_upload', [$this, 'ftl_handle_file_upload']);

        add_action('wp_ajax_ftl_handle_buy_now', [$this, 'ftl_handle_buy_now']);
        add_action('wp_ajax_nopriv_ftl_handle_buy_now', [$this, 'ftl_handle_buy_now']);
        add_action('woocommerce_before_calculate_totals', [$this, 'ftl_woocommerce_before_calculate_totals']);
        add_filter('woocommerce_get_item_data',  [$this, 'ftl_show_custom_item_data'], 10, 2);
        add_action('woocommerce_after_order_itemmeta', [$this, 'ftl_display_order_item_files'], 10, 3);
        add_action('woocommerce_checkout_create_order_line_item', [$this, 'ftl_save_cart_item_data'], 10, 4);
       
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

    public function ftl_handle_buy_now() {
        $word_count = intval($_POST['totalWords'] ?? 0);
        $total_usd = floatval($_POST['totalUSD'] ?? 0);
        $source_lang = sanitize_text_field($_POST['sourceLang'] ?? '');
        $target_lang = sanitize_text_field($_POST['targetLang'] ?? '');
    
        $uploaded_files = [];
    
        if (!empty($_FILES['files'])) {
            foreach ($_FILES['files']['name'] as $index => $name) {
                if ($_FILES['files']['error'][$index] === 0) {
                    $tmp_name = $_FILES['files']['tmp_name'][$index];
                    $unique_name = uniqid() . '-' . sanitize_file_name($name);
                    $upload_dir = wp_upload_dir();
                    $target_path = $upload_dir['path'] . '/' . $unique_name;
    
                    if (move_uploaded_file($tmp_name, $target_path)) {
                        $uploaded_files[] = [
                            'name' => $unique_name,
                            'url' => $upload_dir['url'] . '/' . $unique_name,
                            'path' => $target_path
                        ];
                    }
                }
            }
        }
    
        $product_id = $this->ftl_get_or_create_translation_product();
    
        WC()->cart->empty_cart();
    
        WC()->cart->add_to_cart($product_id, 1, 0, [], [
            'uploaded_files' => $uploaded_files,
            'word_count' => $word_count,
            'total_usd' => $total_usd,
            'source_lang' => $source_lang,
            'target_lang' => $target_lang,
        ]);
    
        wp_send_json_success(['redirect_url' => wc_get_checkout_url()]);
    }
    
    public function ftl_get_or_create_translation_product() {
        $product = get_page_by_title('Translation Service', OBJECT, 'product');
        if ($product)
            return $product->ID;
    
        $post_id = wp_insert_post([
            'post_title' => 'Translation Service',
            'post_type' => 'product',
            'post_status' => 'publish',
        ]);
    
        wp_set_object_terms($post_id, 'simple', 'product_type');
        update_post_meta($post_id, '_price', 0);
        update_post_meta($post_id, '_regular_price', 0);
    
        return $post_id;
    }
    
    public function ftl_woocommerce_before_calculate_totals ($cart) {
        if (is_admin() && !defined('DOING_AJAX')) return;
    
        foreach ($cart->get_cart() as $cart_item) {
            if (isset($cart_item['total_usd'])) {
                $cart_item['data']->set_price($cart_item['total_usd']);
            }
        }
    }

    public function ftl_show_custom_item_data($item_data, $cart_item) {

        if (isset($cart_item['word_count'])) {
            $item_data[] = [
                'key'   => 'Total Word Count',
                'value' => $cart_item['word_count'],
            ];
        }

        if (isset($cart_item['source_lang'])) {
            $item_data[] = [
                'key'   => 'Source Language',
                'value' => $cart_item['source_lang'],
            ];
        }
        
        if (isset($cart_item['target_lang'])) {
            $item_data[] = [
                'key'   => 'Target Language',
                'value' => $cart_item['target_lang'],
            ];
        }
    
        if (!empty($cart_item['uploaded_files'])) {
            $uploaded_files = $cart_item['uploaded_files'];
            $file_count = count($uploaded_files);
    
            $item_data[] = [
                'key'   => 'Total Uploaded File(s)',
                'value' => $file_count,
            ];
    
            foreach ($uploaded_files as $file) {
                $original_filename = basename($file['url']);
                $clean_filename = preg_replace('/^[a-zA-Z0-9]+-/', '', $original_filename);
    
                $item_data[] = [
                    'key'   => 'File Name',
                    'value' => '<a href="' . esc_url($file['url']) . '" target="_blank">' . esc_html($clean_filename) . '</a>',
                ];
            }
        }
        
    
        return $item_data;
    }

    public function ftl_save_cart_item_data($item, $cart_item_key, $values, $order) {
        if (isset($values['word_count'])) {
            $item->add_meta_data('word_count', $values['word_count']);
        }
        
        if (isset($values['uploaded_files'])) {
            $item->add_meta_data('uploaded_files', $values['uploaded_files']);
        }

        if (isset($values['source_lang'])) {
            $item->add_meta_data('source_lang', $values['source_lang']);
        }
        
        if (isset($values['target_lang'])) {
            $item->add_meta_data('target_lang', $values['target_lang']);
        }
    }

    public function ftl_display_order_item_files($item_id, $item, $product) {
        $uploaded_files = $item->get_meta('uploaded_files');
        $word_count = $item->get_meta('word_count');
        $source_lang = $item->get_meta('source_lang');
        $target_lang = $item->get_meta('target_lang');

        // if ($source_lang) {
        //     echo '<p><strong>Source Language:</strong> ' . esc_html($source_lang) . '</p>';
        // }
        // if ($target_lang) {
        //     echo '<p><strong>Target Language:</strong> ' . esc_html($target_lang) . '</p>';
        // }
        
        if (!empty($uploaded_files) && is_array($uploaded_files)) {
            echo '<div class="ftl-files-section" style="margin: 10px 0; padding: 10px; background: #f8f8f8; border-radius: 4px;">';
            echo '<strong>Uploaded File(s) : ' . count($uploaded_files) . '</strong><br>';
            
            foreach ($uploaded_files as $file) {
                $original_filename = basename($file['url']);
                $clean_filename = preg_replace('/^[a-zA-Z0-9]+-/', '', $original_filename);
                
                echo '<div style="margin: 5px 0; padding: 5px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">';
                echo '<a href="' . esc_url($file['url']) . '" target="_blank" style="text-decoration: none; color: #2271b1;">';
                echo '<span style="margin-right: 5px;">📄</span>' . esc_html($clean_filename);
                echo '</a>';
                echo '<a href="' . esc_url($file['url']) . '" download style="text-decoration: none; color: #2271b1;">';
                echo '<span style="font-size: 18px;">⬇️</span>';
                echo '</a>';
                echo '</div>';
            }
            
            echo '</div>';
        }
    }

    public function ftl_check_woocommerce() {
        if (!class_exists('WooCommerce')) {
            ?>
            <div class="notice notice-error is-dismissible">
                <p>
                    <?php 
                    _e('Translation Uploader requires WooCommerce to be installed and activated. Please install and activate WooCommerce to use payment features.', 'translation-uploader'); 
                    ?></p>
            </div>
            <?php
        }
    }

 }
 
 Translation_Uploader::get_instance();

    


 


 

 


 









