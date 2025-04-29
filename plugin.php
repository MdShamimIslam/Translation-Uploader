<?php
/**
 * Plugin Name: Translation Uploader
 * Description: Upload and count words for translation.
 * Version: 1.0.0
 * Author: Md. Shamim Islam
 */

defined('ABSPATH') || exit;

add_action('admin_enqueue_scripts', function () {
    wp_enqueue_script(
        'translation-uploader',
        plugins_url('/build/index.js', __FILE__),
        ['wp-element'],
        filemtime(plugin_dir_path(__FILE__) . '/build/index.js'),
        true
    );
    // wp_enqueue_style(
    //     'translation-uploader-style',
    //     plugins_url('/build/style.css', __FILE__),
    //     [],
    //     filemtime(plugin_dir_path(__FILE__) . '/build/style.css')
    // );
});

add_action('admin_menu', function () {
    add_menu_page(
        'Translation Uploader',
        'Translation Uploader',
        'manage_options',
        'translation-uploader',
        'translation_uploader_page',
        'dashicons-upload',
        6
    );
});

function translation_uploader_page() {
    echo '<div class="wrap">';
    echo '<h1>Translation Uploader</h1>';
    echo '<div id="translation-uploader-root"></div>';
    echo '</div>';
}



