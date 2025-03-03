<?php

/**
 * Plugin Name:       Marciblocks Carousel
 * Description:       Carousel of images with thumbnails tabs and controls.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Marcico
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       marciblocks-carousel
 *
 * @package CreateBlock
 */

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_marciblocks_carousel_block_init() {
    register_block_type(
        __DIR__ . '/build/marciblocks-carousel',
        ['render_callback' => 'marciblocks_carousel_render']
    );
    register_block_type(__DIR__ . '/build/marciblocks-carousel-item');
}
add_action('init', 'create_block_marciblocks_carousel_block_init');

/**
 * Internationalization
 *
 * @return void
 */
function marciblocks_carousel_setup_translation() {
    // Load translations
    load_plugin_textdomain(
        'marciblocks-carousel',
        false,
        dirname(plugin_basename(__FILE__)) . '/languages'
    );

    // Editor script translations
    wp_set_script_translations(
        'marciblocks-carousel-editor-script',
        'marciblocks-carousel',
        plugin_dir_path(__FILE__) . 'languages'
    );
}
add_action('init', 'marciblocks_carousel_setup_translation');

/**
 * Render of carousel
 *
 * @param [type] $attributes
 * @param [type] $block
 * @return void
 */
function marciblocks_carousel_render($attributes) {
    // Object-fit rule for images in their container - items and tabs
    $image_fit         = isset($attributes['imageFit']) ? esc_attr($attributes['imageFit']) : 'cover';

    // Border-radius rule for items and tabs
    $is_radius         = isset($attributes['isRadius']) ? esc_attr($attributes['isRadius']) : false;
    $border_radius     = ($is_radius && isset($attributes['radius'])) ? esc_attr($attributes['radius']) : '14';

    // Aspect-ratio rule for items ands tabs
    $aspect_ratio      = isset($attributes['aspectRatio']) ? esc_attr($attributes['aspectRatio']) : '16/9';

    // Custom color used for tab highlight
    // It is set as variable in carousel container scope as style, then used in style.css as variable
    // Used to style tab::after box-shadow on highlight
    $highlight_color   = isset($attributes['highlightColor']) ? esc_attr($attributes['highlightColor']) : '#00B308';

    // Custom color used for the background of carousel items and tabs
    $background_color  = isset($attributes['backgroundColor']) ? esc_attr($attributes['backgroundColor']) : '';

    // Show texts or not
    $is_caption        = isset($attributes['isCaption']) ? esc_attr($attributes['isCaption']) : false;
    $is_description    = isset($attributes['isDescription']) ? esc_attr($attributes['isDescription']) : false;

    // If texts are shown we use their colors
    $caption_color     = ($is_caption && isset($attributes['captionColor'])) ? esc_attr($attributes['captionColor']) : 'white';
    $description_color = ($is_description && isset($attributes['descriptionColor'])) ? esc_attr($attributes['descriptionColor']) : '';

    // Number of the current carousel among the carousels of the current publication
    // Used in particular for identification of content on the page controled by button controls
    $carousel_number   = isset($attributes['carouselNumber']) ? esc_attr($attributes['carouselNumber']) : 0;
    $images_ids        = isset($attributes['imagesIds']) ? $attributes['imagesIds'] : [];

    // Prepare images data
    $images = array();

    foreach ($images_ids as $image_id) {
        if (empty($image_id)) continue;

        /**
         * Call methods performance tests
         * To be performed in staging environment
         */

        // 01 - One call to wp_prepare_attachment_for_js() method
        // $attachment = wp_prepare_attachment_for_js($image_id);
        // $medium_url = $attachment['sizes']['medium']['url'];
        // $large_url = $attachment['sizes']['large']['url'] ?? $attachment['sizes']['full']['url'];
        // $image_alt = $attachment['alt'];
        // $image_caption = $attachment['caption'];
        // $image_desc = $attachment['description'];

        // 02 - Multiple calls method
        $medium_url    = wp_get_attachment_image_url($image_id, 'medium');
        $large_url     = wp_get_attachment_image_url($image_id, 'large');
        $image_alt     = get_post_meta($image_id, '_wp_attachment_image_alt', true);
        $image_caption = $is_caption ? wp_get_attachment_caption($image_id) : '';
        $image_desc    = $is_description ? get_post_field('post_content', $image_id) : '';

        $images[] = array(
            'medium_url'    => $medium_url ?? '',
            'large_url'     => $large_url ?? '',
            'image_alt'     => $image_alt ?? '',
            'image_caption' => $image_caption ?? '',
            'image_desc'    => $image_desc ?? ''
        );
    }

    if (empty($images)) {
        return ''; // Return empty string if no images
    }

    ob_start();
?>
    <section
        id="marciblocks-carousel-<?php echo esc_attr($carousel_number); ?>"
        <?php echo get_block_wrapper_attributes(); ?>
        aria-roledescription="<?php esc_attr_e('carousel', 'marciblocks-carousel'); ?>"
        style="--carousel-custom-highlight-color: <?php echo esc_attr($highlight_color); ?>">

        <div class="marciblocks-carousel-main">
            <!-- Images -->
            <div
                id="marciblocks-carousel-items-<?php echo esc_attr($carousel_number); ?>"
                class="marciblocks-carousel-items"
                aria-live="polite"
                style="aspect-ratio: <?php echo esc_attr($aspect_ratio); ?>;
                       <?php if ($background_color) : ?>
                           background-color: <?php echo esc_attr($background_color); ?>;
                       <?php endif; ?>
                       <?php if ($is_radius) : ?>
                           border-radius: <?php echo esc_attr($border_radius); ?>px;
                       <?php endif; ?>">

                <?php foreach ($images as $index => $image) : ?>
                    <div
                        id="marciblocks-carousel-items__item-<?php echo esc_attr($index + 1); ?>"
                        class="marciblocks-carousel-items__item"
                        role="tabpanel"
                        aria-roledescription="<?php esc_attr_e('slide', 'marciblocks-carousel'); ?>"
                        aria-label="<?php echo esc_attr(sprintf('%1$d %2$s %3$d', $index + 1, __('of', 'marciblocks-carousel'), count($images))); ?>">

                        <img
                            data-src="<?php echo esc_url($image['large_url']); ?>"
                            alt="<?php echo esc_attr($image['image_alt']); ?>"
                            style="object-fit: <?php echo esc_attr($image_fit); ?>"
                            loading="lazy" />

                        <?php if ($is_caption && $image['image_caption']) : ?>
                            <h3
                                class="marciblocks-carousel-items__item__caption"
                                style="color: <?php echo esc_attr($caption_color); ?>">
                                <?php echo esc_html($image['image_caption']); ?>
                            </h3>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>

            <!-- Controls -->
            <div class="marciblocks-carousel-controls">
                <button
                    type="button"
                    aria-controls="marciblocks-carousel-items-<?php echo esc_attr($carousel_number); ?>"
                    aria-label="<?php esc_attr_e('Previous slide', 'marciblocks-carousel'); ?>"
                    class="marciblocks-carousel-controls__control marciblocks-carousel-controls__control--prev">
                    <span class="marciblocks-carousel-controls__control-arrow"></span>
                </button>
                <button
                    type="button"
                    aria-controls="marciblocks-carousel-items-<?php echo esc_attr($carousel_number); ?>"
                    aria-label="<?php esc_attr_e('Next slide', 'marciblocks-carousel'); ?>"
                    class="marciblocks-carousel-controls__control marciblocks-carousel-controls__control--next">
                    <span class="marciblocks-carousel-controls__control-arrow"></span>
                </button>
            </div>
        </div>

        <!-- Descriptions -->
        <?php if ($is_description) : ?>
            <div class="marciblocks-carousel-descs">
                <?php foreach ($images as $image) : ?>
                    <p
                        class="marciblocks-carousel-descs__desc"
                        aria-hidden="true"
                        style="color: <?php echo esc_attr($description_color); ?>">
                        <?php echo esc_html($image['image_desc']); ?>
                    </p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <!-- Tabs -->
        <div
            class="marciblocks-carousel-tabs"
            role="tablist"
            aria-label="<?php esc_attr_e('Slides', 'marciblocks-carousel'); ?>">
            <?php foreach ($images as $index => $image) : ?>
                <button
                    class="marciblocks-carousel-tabs__tab"
                    type="button"
                    role="tab"
                    tabindex="-1"
                    aria-selected="false"
                    aria-controls="carousel-items__item-<?php echo esc_attr($index + 1); ?>"
                    aria-label="<?php echo esc_attr(sprintf('%1$s %2$d', __('Slide', 'marciblocks-carousel'), $index + 1)); ?>"
                    style="aspect-ratio: <?php echo esc_attr($aspect_ratio); ?>;
                           <?php if ($background_color) : ?>
                               background-color: <?php echo esc_attr($background_color); ?>;
                           <?php endif; ?>
                           <?php if ($is_radius) : ?>
                               border-radius: <?php echo esc_attr($border_radius); ?>px;
                           <?php endif; ?>">

                    <img
                        src="<?php echo esc_url($image['medium_url']); ?>"
                        class="<?php echo ($index === 0) ? 'is-selected' : ''; ?>"
                        data-index="<?php echo esc_attr($index); ?>"
                        alt="<?php echo esc_attr($image['image_alt']); ?>"
                        style="object-fit: <?php echo esc_attr($image_fit); ?>"
                        loading="lazy" />
                </button>
            <?php endforeach; ?>
        </div>
    </section>
<?php
    return ob_get_clean();
}
