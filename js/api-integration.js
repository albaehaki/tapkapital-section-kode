/**
 * Tap Kapital — API Integration v6
 * - Products: DATA REAL dari WooCommerce (50 produk langsung di inline)
 * - Blog: fetch live dari WP API, fallback ke data statis
 * - Gallery: statis (di HTML)
 */
(function(w,d){
'use strict';

var MON = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

// ─── DATA REAL WOOCOMMERCE ───
var WC_PRODS = [
    {n:"Certified Risk Professional (CRP)",p:"Rp 5.200.000 - 9.500.000",tags:["CRP","Manajemen Risiko"],desc:"Manajemen risiko level Madya & Utama. Online & Offline.",icon:"shield",img:"https://www.tapkapital.co.id/wp-content/uploads/2025/06/TATA-KELOLA-ORGANISASI.jpg"},
    {n:"Certified Securities Analyst (CSA)",p:"Rp 7.500.000 - 12.000.000",tags:["CSA","Analis Efek"],desc:"Sertifikasi analis efek dari pengenalan hingga utama.",icon:"finance",img:"https://www.tapkapital.co.id/wp-content/uploads/2025/06/csa.jpg"},
    {n:"Certified Fixed Income Analyst (CFIA)",p:"Rp 1.000.000",tags:["CFIA"],desc:"Analisis efek pendapatan tetap. Sertifikasi diakui OJK.",icon:"finance",img:"https://www.tapkapital.co.id/wp-content/uploads/2025/06/cfia.jpg"},
    {n:"Regular Investment Banking (CIB)",p:"Rp 6.500.000",tags:["CIB","Investment Banking"],desc:"Investment Banking Madya — penilaian perusahaan, M&A, IPO.",icon:"account_balance",img:"https://www.tapkapital.co.id/wp-content/uploads/2019/07/LOGO-CIB.png"},
    {n:"Registered Technical Analyst (RTA)",p:"Rp 4.500.000",tags:["RTA","CTA","Teknikal"],desc:"Analisis teknikal — chart pattern, indikator, timing entry/exit.",icon:"trending_up",img:""},
    {n:"Wakil Manajer Investasi (WMI)",p:"Rp 4.300.000",tags:["WMI","Lisensi OJK"],desc:"Persiapan ujian lisensi OJK — simulasi soal real.",icon:"assignment",img:"https://www.tapkapital.co.id/wp-content/uploads/2025/06/WMI.png"},
    {n:"Wakil Perantara Pedagang Efek (WPPE)",p:"Rp 5.000.000",tags:["WPPE","Lisensi OJK"],desc:"Lisensi perantara pedagang efek untuk profesi pasar modal.",icon:"assignment",img:"https://www.tapkapital.co.id/wp-content/uploads/2019/07/Pelatihan-Wakil-Pedagang-Perantara-Efek-WPPE-di-Amaris-Hotel-Jakarta-dengan-peserta-seluruh-karyawan-Equator-Sekuritas..jpg"},
    {n:"Wakil Penjamin Emisi Efek (WPEE)",p:"Rp 5.000.000",tags:["WPEE","Lisensi OJK"],desc:"Lisensi penjamin emisi efek untuk profesi investment banking.",icon:"assignment",img:"https://www.tapkapital.co.id/wp-content/uploads/2025/06/WPEE.png"},
    {n:"Manajemen Risiko (CRP For Executive)",p:"Rp 8.500.000",tags:["CRP","Executive"],desc:"Program eksekutif manajemen risiko untuk level direksi.",icon:"shield",img:""},
    {n:"Training of Trainer",p:"Rp 6.500.000",tags:["TOT","KKNI Lv4"],desc:"14 unit kompetensi — cetak trainer profesional bersertifikasi.",icon:"groups",img:""},
    {n:"Risk Officer Training",p:"Rp 3.850.000",tags:["Risk Officer"],desc:"Pelatihan dasar manajemen risiko untuk staf operasional.",icon:"shield",img:""},
    {n:"Bundling CSA (Distance Learning)",p:"Rp 9.500.000",tags:["CSA","Bundle"],desc:"Paket lengkap analis efek utama — dari dasar hingga mahir.",icon:"school",img:""},
    {n:"Pengelolaan Analisis Teknikal (CTA)",p:"Rp 8.500.000",tags:["CTA"],desc:"Certified Technical Analyst — analisis teknikal level mahir.",icon:"trending_up",img:""},
    {n:"Upgrade RSA ke CSA",p:"Rp 4.500.000",tags:["RSA","CSA"],desc:"Program upgrade dari analis reguler ke tersertifikasi.",icon:"trending_up",img:""},
    {n:"Pengelolaan Investasi",p:"Hubungi kami",tags:["Mandatory OJK"],desc:"Program mandatory OJK untuk profesi pengelolaan investasi.",icon:"verified",img:""}
];

var FALLBACK_POSTS = [
    {t:"Panduan Lengkap Sertifikasi WMI untuk Pemula",d:"2026-06-05",e:"Pelajari langkah-langkah, biaya, dan tips lulus ujian WMI.",c:"Karir"},
    {t:"Perbedaan CSA Level 1, 2, dan 3",d:"2026-05-28",e:"Membandingkan ketiga level sertifikasi CSA.",c:"Edukasi"},
    {t:"OJK Perbarui Regulasi Sertifikasi 2026",d:"2026-05-15",e:"Perubahan prosedur sertifikasi profesi pasar modal.",c:"Berita"},
    {t:"Mengenal ISO 31000: Standar Manajemen Risiko",d:"2026-05-10",e:"Penerapan ISO 31000 di pasar modal Indonesia.",c:"Edukasi"},
    {t:"Jadi Trainer Profesional dengan TOT KKNI Lv4",d:"2026-05-02",e:"Peluang karir trainer bersertifikasi BNSP.",c:"Karir"},
    {t:"Prospek Karir Investment Banking 2026",d:"2026-04-25",e:"Peluang karir IB dan sertifikasi dibutuhkan.",c:"Edukasi"}
];

// ─── FETCH ───
function fetchJSON(url, cb) {
    var x = new XMLHttpRequest();
    x.open('GET', url, true);
    x.timeout = 8000;
    x.setRequestHeader('Accept','application/json');
    x.onload = function(){
        if (x.status>=200&&x.status<300) { try{cb(null,JSON.parse(x.responseText))}catch(e){cb(e,null)} }
        else cb(new Error('HTTP '+x.status),null);
    };
    x.onerror = function(){ cb(new Error('ERR'),null); };
    x.ontimeout = function(){ cb(new Error('TO'),null); };
    x.send();
}

// ─── UTILS ───
function fmt(d){
    if(!d)return'';
    var t=new Date(d);
    return isNaN(t.getTime())?'':t.getDate()+' '+MON[t.getMonth()]+' '+t.getFullYear();
}
function strip(h,m){
    if(!h)return'';m=m||160;
    var x=d.createElement('div');x.innerHTML=h;
    var t=(x.textContent||x.innerText||'').replace(/\s+/g,' ').trim();
    return t.length>m?t.substr(0,m)+'...':t;
}

// ─── TK ───
var TK = {};
var _cache = {};

TK.empty = function(m){
    return '<div style="grid-column:1/-1;text-align:center;padding:40px 20px;">'+
        '<span class="material-symbols-outlined" style="font-size:2.5rem;color:#9ca3af;">inbox</span>'+
        '<p style="color:#4b5563;font-size:0.8rem;margin-top:8px;">'+(m||'Belum ada data.')+'</p></div>';
};

// PROGRAM — match .prog-slide > .img-area + .content
TK.prodCard = function(p,i){
    var n = p.n||''; if(!n)return'';
    var pr = p.p||'';
    var tags = p.tags||[];
    var desc = p.desc||'';
    var icon = p.icon||'school';
    var badge = i===0?'✦ Unggulan':'';
    var gradients = ['risk','analis','invest','teknikal','ojk','tot','risk','analis','invest','teknikal','ojk','tot','risk','analis','invest'];
    var img = p.img||'';
    var im = img ? '<img src="'+img+'" alt="'+n+'" style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;z-index:1;">' : '';
    return '<div class="prog-slide">'+
        '<div class="img-area img-'+gradients[(i||0)%6]+'" style="position:relative;"><div class="img-pattern"></div>'+
        (badge?'<span class="overlay-badge">'+badge+'</span>':'')+
        '<div class="overlay-icon"><span class="material-symbols-outlined">'+icon+'</span></div>'+
        im+
        (!img?'<div class="placeholder">FOTO '+n.replace(/[^A-Za-z0-9 ]/g,'').toUpperCase()+'</div>':'')+'</div>'+
        '<div class="content"><div class="p-name">'+n+'</div>'+
        '<div class="p-tags">'+tags.map(function(tg){return '<span>'+tg+'</span>';}).join('')+'</div>'+
        '<div class="p-desc">'+desc+'</div>'+
        '<div class="p-footer"><div class="price">'+pr+' <span>/ program</span></div>'+
        '<div class="cta">Lihat Detail <span class="material-symbols-outlined" style="font-size:0.6rem;">arrow_forward</span></div></div></div></div>';
};

// BLOG — match .blog-card > .blog-img + .blog-body
TK.postCard = function(p,i){
    var t = (p.title&&p.title.rendered?p.title.rendered:p.t);
    if(!t)return'';
    var dd = fmt(p.date||p.d);
    var ee = strip((p.excerpt&&p.excerpt.rendered?p.excerpt.rendered:p.e),120);
    var img=(function(){try{return p._embedded['wp:featuredmedia'][0].source_url}catch(x){return ''}})();
    var cat=(function(){try{return p._embedded['wp:term'][0][0].name}catch(x){return p.c||'Edukasi'}})();
    var g=['0a2647,1a4a7a','1a3a5c,2c4c7e','0d3360,0a2647'];
    var im=img?'<img src="'+img+'" alt="'+t+'" style="width:100%;height:100%;object-fit:cover;">'
             :'<span class="material-symbols-outlined" style="font-size:2rem;color:rgba(255,255,255,0.08);">article</span>';
    return '<div class="blog-card">'+
        '<div class="blog-img"><div class="blog-img-placeholder" style="background:linear-gradient(135deg,'+g[(i||0)%3]+');">'+im+'</div><span class="blog-cat">'+cat+'</span></div>'+
        '<div class="blog-body"><div class="blog-meta">'+dd+' · 3 menit baca</div><h3>'+t+'</h3><p>'+ee+'</p>'+
        '<div class="blog-link"><span class="material-symbols-outlined">arrow_forward</span> Baca Selengkapnya</div></div></div>';
};

// ─── RENDER PROGRESS CARD (untuk halaman Semua Program) ───
function renderProgCard(p, i) {
    var n = p.n||'';
    if(!n) return '';
    var pr = p.p||'';
    var tags = p.tags||[];
    var desc = p.desc||'';
    var icon = p.icon||'school';
    var badge = i===0?'Unggulan':'';
    var gradients = ['0a2647,1a4a7a','1a3a5c,2c4c7e','0d3360,0a2647','2c4c7e,4a6a9e','051530,0a2647','1a4a7a,3a6a9e','2c1a2e,4a2a4e','1a3a2e,2a5a3e','3a2a1a,5a3a2a','0a2647,1a4a7a','1a3a5c,2c4c7e','0d3360,0a2647','2c4c7e,4a6a9e','051530,0a2647','1a4a7a,3a6a9e'];
    var img = p.img||'';
    var icons = {'shield':'diamond','finance':'bar_chart','account_balance':'account_balance','trending_up':'trending_up','assignment':'assignment','groups':'groups','school':'school','verified':'verified'};
    var ic = icons[icon]||'school';
    var im = img ? '<img src="'+img+'" alt="'+n+'" style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;">' : '<span class="material-symbols-outlined pc-icon">'+ic+'</span>';
    return '<div class="prog-card">'+
        '<div class="pc-img" style="background:linear-gradient(135deg,'+gradients[(i||0)%15]+');position:relative;">'+im+
        (badge?'<span class="pc-badge">✦ '+badge+'</span>':'')+'</div>'+
        '<div class="pc-body"><div class="pc-name">'+n+'</div>'+
        '<div class="pc-tags">'+tags.map(function(tg){return '<span>'+tg+'</span>';}).join('')+'</div>'+
        '<div class="pc-desc">'+desc+'</div>'+
        '<div class="pc-footer"><div class="pc-price">'+pr+' <span>/ program</span></div>'+
        '<div class="pc-cta">Lihat Detail <span class="material-symbols-outlined" style="font-size:0.6rem;">arrow_forward</span></div></div></div></div>';
}

// ─── RENDER ───
function renderAll(){
    // Products — untuk .prog-slide (carousel)
    d.querySelectorAll('[data-wp-produk]').forEach(function(el){
        var max = parseInt(el.getAttribute('data-wp-produk'))||6;
        var isGrid = el.classList.contains('prog-grid');
        if (isGrid) {
            // Untuk halaman Semua Program — render .prog-card
            el.innerHTML=WC_PRODS.slice(0,max).map(function(p,i){return renderProgCard(p,i);}).join('');
        } else {
            el.innerHTML=WC_PRODS.slice(0,max).map(function(p,i){return TK.prodCard(p,i);}).join('');
        }
    });
    // Blog — fallback, background fetch
    var posts = _cache.posts||FALLBACK_POSTS;
    d.querySelectorAll('[data-wp-blog]').forEach(function(el){
        var max = parseInt(el.getAttribute('data-wp-blog'))||6;
        el.innerHTML=posts.slice(0,max).map(function(p,i){return TK.postCard(p,i);}).join('');
        // Tambah tombol di luar grid
        var btn = document.createElement('div');
        btn.style.cssText = 'text-align:center;margin-top:24px;';
        btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:6px;padding:10px 24px;background:#0a2647;color:#fff;border-radius:10px;font-size:0.7rem;font-weight:600;cursor:pointer;" onclick="window.location.href=\'tapkapital-blog.html\'">Lihat Semua Artikel <span class="material-symbols-outlined" style="font-size:0.8rem;">arrow_forward</span></span>';
        el.parentNode.insertBefore(btn, el.nextSibling);
    });
}

// ─── BG FETCH ───
fetchJSON('https://www.tapkapital.co.id/wp-json/wp/v2/posts?per_page=10&_embed=1', function(err,data){
    if(!err&&data&&data.length){_cache.posts=data;renderAll();}
});

d.addEventListener('DOMContentLoaded', renderAll);
w.TAPKAPITAL=TK;
})(window,document);
