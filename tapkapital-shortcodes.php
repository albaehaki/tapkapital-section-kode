<?php
/**
 * Plugin Name: Tap Kapital Shortcodes
 * Description: Shortcode untuk landing page Tap Kapital — ambil data langsung dari WooCommerce & WP Posts tanpa JS.
 * Version: 1.0
 * Author: Tap Kapital Indonesia
 *
 * Cara pakai di WPBakery:
 *   [tk_produk limit="6"]     — Grid produk dari WooCommerce
 *   [tk_artikel limit="3"]    — Artikel terbaru
 *   [tk_galeri limit="9"]     — Gallery dari Media Library
 */

// ============================================================
// 1. SHORTCODE PRODUK — ambil dari WooCommerce
// ============================================================
add_shortcode('tk_produk', function($atts) {
    $atts = shortcode_atts(['limit' => 6], $atts);
    
    if (!class_exists('WooCommerce')) {
        return '<p style="color:#4b5563;">WooCommerce belum aktif.</p>';
    }
    
    $products = wc_get_products([
        'limit'  => intval($atts['limit']),
        'status' => 'publish'
    ]);
    
    if (empty($products)) {
        return '<div style="text-align:center;padding:40px;color:#4b5563;">Belum ada produk tersedia.</div>';
    }
    
    $html = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">';
    
    foreach ($products as $i => $p) {
        $nama  = esc_html($p->get_name());
        $harga = $p->get_price() ? 'Rp ' . number_format(floatval($p->get_price()), 0, ',', '.') : 'Hubungi kami';
        $gambar_id = $p->get_image_id();
        $gambar = $gambar_id ? wp_get_attachment_image_url($gambar_id, 'medium') : '';
        $kategori = strip_tags(wc_get_product_category_list($p->get_id()));
        $deskripsi = esc_html(wp_trim_words($p->get_short_description() ?: $p->get_description(), 15));
        $link = get_permalink($p->get_id());
        $gradients = ['#0a2647,#1a4a7a','#1a3a5c,#2c4c7e','#0d3360,#0a2647','#2c4c7e,#4a6a9e','#051530,#0a2647','#1a4a7a,#3a6a9e'];
        $g = $gradients[$i % count($gradients)];
        
        $html .= '<div style="background:#fff;border:1px solid #e9ecf0;border-radius:16px;overflow:hidden;transition:all 0.3s;">';
        $html .= '<div style="height:160px;background:linear-gradient(135deg,'.$g.');position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;">';
        if ($gambar) {
            $html .= '<img src="'.esc_url($gambar).'" alt="'.$nama.'" style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;">';
        } else {
            $html .= '<span class="material-symbols-outlined" style="font-size:2.5rem;color:rgba(255,255,255,0.15);">school</span>';
        }
        $html .= '</div>';
        $html .= '<div style="padding:16px 18px 20px;">';
        $html .= '<div style="font-size:0.85rem;font-weight:700;color:#0a2647;">'.$nama.'</div>';
        if ($kategori) {
            $html .= '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;"><span style="font-size:0.5rem;padding:2px 10px;border-radius:50px;background:rgba(253,165,39,0.08);color:#fda527;font-weight:600;">'.$kategori.'</span></div>';
        }
        if ($deskripsi) {
            $html .= '<div style="font-size:0.65rem;color:#4b5563;margin-top:8px;line-height:1.5;">'.$deskripsi.'</div>';
        }
        $html .= '<div style="margin-top:14px;padding-top:12px;border-top:1px solid #f0f4f8;display:flex;align-items:center;justify-content:space-between;">';
        $html .= '<div style="font-size:0.75rem;font-weight:700;color:#0a2647;">'.$harga.' <span style="font-size:0.55rem;color:#4b5563;font-weight:400;">/ program</span></div>';
        $html .= '<a href="'.esc_url($link).'" style="font-size:0.6rem;color:#fda527;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:4px;">Lihat Detail →</a>';
        $html .= '</div></div></div>';
    }
    
    $html .= '</div>';
    return $html;
});

// ============================================================
// 2. SHORTCODE ARTIKEL — ambil dari WP Posts
// ============================================================
add_shortcode('tk_artikel', function($atts) {
    $atts = shortcode_atts(['limit' => 3], $atts);
    
    $posts = get_posts([
        'numberposts' => intval($atts['limit']),
        'post_status' => 'publish'
    ]);
    
    if (empty($posts)) {
        return '<div style="text-align:center;padding:40px;color:#4b5563;">Belum ada artikel.</div>';
    }
    
    $html = '<div style="display:grid;grid-template-columns:repeat('.min(3,intval($atts['limit'])).',1fr);gap:16px;">';
    
    foreach ($posts as $p) {
        $judul = esc_html($p->post_title);
        $excerpt = esc_html(wp_trim_words($p->post_excerpt ?: $p->post_content, 20));
        $tanggal = get_the_date('j F Y', $p);
        $link = get_permalink($p);
        $thumb = get_the_post_thumbnail_url($p->ID, 'medium');
        $kategori = '';
        $cats = get_the_category($p->ID);
        if (!empty($cats)) $kategori = esc_html($cats[0]->name);
        $gradients = ['#0a2647,#1a4a7a','#1a3a5c,#2c4c7e','#0d3360,#0a2647'];
        static $idx = 0;
        $g = $gradients[$idx % 3]; $idx++;
        
        $html .= '<div style="background:#fff;border:1px solid #e9ecf0;border-radius:14px;overflow:hidden;">';
        $html .= '<div style="height:160px;background:linear-gradient(135deg,'.$g.');position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;">';
        if ($thumb) {
            $html .= '<img src="'.esc_url($thumb).'" alt="'.$judul.'" style="width:100%;height:100%;object-fit:cover;">';
        } else {
            $html .= '<span class="material-symbols-outlined" style="font-size:2rem;color:rgba(255,255,255,0.08);">article</span>';
        }
        if ($kategori) {
            $html .= '<span style="position:absolute;top:10px;left:10px;padding:3px 12px;border-radius:50px;background:#fda527;color:#051530;font-size:0.5rem;font-weight:700;">'.$kategori.'</span>';
        }
        $html .= '</div>';
        $html .= '<div style="padding:16px;">';
        $html .= '<div style="font-size:0.55rem;color:#9ca3af;margin-bottom:6px;">'.$tanggal.'</div>';
        $html .= '<h3 style="font-size:0.8rem;font-weight:700;color:#0a2647;margin:0;">'.$judul.'</h3>';
        $html .= '<p style="font-size:0.65rem;color:#4b5563;margin-top:6px;line-height:1.5;">'.$excerpt.'</p>';
        $html .= '<a href="'.esc_url($link).'" style="font-size:0.6rem;color:#fda527;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:4px;margin-top:10px;">→ Baca Selengkapnya</a>';
        $html .= '</div></div>';
    }
    
    $html .= '</div>';
    return $html;
});

// ============================================================
// 3. SHORTCODE GALERI — ambil dari Media Library
// ============================================================
add_shortcode('tk_galeri', function($atts) {
    $atts = shortcode_atts(['limit' => 9], $atts);
    
    $images = get_posts([
        'post_type'      => 'attachment',
        'post_mime_type' => 'image',
        'posts_per_page' => intval($atts['limit']),
        'post_status'    => 'inherit',
        'orderby'        => 'date',
        'order'          => 'DESC'
    ]);
    
    if (empty($images)) {
        return '<div style="text-align:center;padding:40px;color:#4b5563;">Belum ada dokumentasi.</div>';
    }
    
    $html = '<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;">';
    
    foreach ($images as $i => $img) {
        $src = wp_get_attachment_image_url($img->ID, 'medium_large');
        $judul = esc_html($img->post_title ?: 'Dokumentasi');
        $feat = ($i === 0) ? 'grid-row:1/3;aspect-ratio:auto;min-height:320px;' : '';
        
        $html .= '<div style="border-radius:14px;overflow:hidden;position:relative;'.$feat.'aspect-ratio:16/10;background:#f0f4f8;border:1px solid #e9ecf0;">';
        $html .= '<img src="'.esc_url($src).'" alt="'.$judul.'" style="width:100%;height:100%;object-fit:cover;">';
        $html .= '<div style="position:absolute;bottom:0;left:0;right:0;padding:20px 16px 14px;background:linear-gradient(transparent,rgba(10,38,71,0.7));color:#fff;font-size:0.7rem;font-weight:600;">'.$judul.'</div>';
        $html .= '</div>';
    }
    
    $html .= '</div>';
    return $html;
});

// ============================================================
// 4. SHORTCODE JADWAL
// ============================================================
add_shortcode('tk_jadwal', function() {
    // Ambil produk yang ada harganya (dianggap program aktif)
    $products = wc_get_products(['limit' => 10, 'status' => 'publish']);
    
    if (empty($products)) {
        return '<div style="text-align:center;padding:40px;color:#4b5563;">Belum ada jadwal tersedia.</div>';
    }
    
    $html = '<div style="display:flex;flex-direction:column;gap:10px;">';
    
    foreach ($products as $p) {
        $nama = esc_html($p->get_name());
        $harga = $p->get_price() ? 'Rp ' . number_format(floatval($p->get_price()), 0, ',', '.') : 'Hubungi kami';
        $link = get_permalink($p->get_id());
        
        $html .= '<div style="display:grid;grid-template-columns:1fr auto auto;gap:14px;align-items:center;padding:16px 20px;background:#fff;border:1px solid #e9ecf0;border-radius:14px;">';
        $html .= '<div style="font-size:0.8rem;font-weight:700;color:#0a2647;">'.$nama.'</div>';
        $html .= '<div style="font-size:0.65rem;color:#4b5563;padding:4px 12px;border-radius:6px;background:#f0f4f8;">'.$harga.'</div>';
        $html .= '<a href="'.esc_url($link).'" style="padding:7px 16px;border-radius:50px;background:#fda527;color:#051530;font-size:0.6rem;font-weight:700;text-decoration:none;text-align:center;">Lihat Detail</a>';
        $html .= '</div>';
    }
    
    $html .= '</div>';
    return $html;
});
