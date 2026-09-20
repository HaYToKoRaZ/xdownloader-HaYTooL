const translations = {
  tr: {
    flag: '🇹🇷',
    label: 'TR',
    badge: '✨ Gelişmiş X (Twitter) Medya İndirici',
    title1: 'X / Twitter Medyalarını',
    title2: 'Tek Tıkla En Yüksek Kalitede İndirin',
    desc: 'Videolar, fotoğraflar ve animasyonlu GIF\'ler... Orijinal çözünürlüklerinde, anında ve güvenli bir şekilde bilgisayarınıza kaydedin. Tamamen yerel, reklamsız ve hızlı.',
    btnGithub: 'GitHub\'da İncele',
    btnDownload: 'Son Sürümü İndir (v1.0.6) 📦',
    btnPortal: 'Diğer HaYTooL Projeleri ↗',
    storeTitle: 'Desteklenen Tarayıcılar ve Mağazalar',
    feat1Title: 'Anında İndirme',
    feat1Desc: 'Tweetlerin altına entegre olan indirme butonuyla tek tıklamayla medyayı kaydedin.',
    feat2Title: 'En Yüksek Çözünürlük',
    feat2Desc: 'Videolarda 1080p / 4K ve fotoğraflarda maksimum orijinal boyut seçeneği.',
    feat3Title: 'Gizlilik Odaklı',
    feat3Desc: 'Verileriniz hiçbir üçüncü taraf sunucuya aktarılmaz. İndirmeler doğrudan yerel yapılır.',
    privacyLink: 'Gizlilik Politikası',
  },
  en: {
    flag: '🇬🇧',
    label: 'EN',
    badge: '✨ Advanced X (Twitter) Media Downloader',
    title1: 'Download X / Twitter Media',
    title2: 'In Highest Quality With One Click',
    desc: 'Videos, photos, and animated GIFs... Save them directly to your device at original resolution instantly and safely. Completely local, ad-free, and fast.',
    btnGithub: 'View on GitHub',
    btnDownload: 'Download Latest (v1.0.6) 📦',
    btnPortal: 'Other HaYTooL Projects ↗',
    storeTitle: 'Supported Browsers & Stores',
    feat1Title: 'Instant Download',
    feat1Desc: 'Save media with a single click using the download button seamlessly embedded under tweets.',
    feat2Title: 'Highest Quality',
    feat2Desc: 'Download 1080p / 4K videos and original full-resolution photos.',
    feat3Title: 'Privacy-Focused',
    feat3Desc: 'Your data is never sent to third-party servers. All downloads are handled directly and locally.',
    privacyLink: 'Privacy Policy',
  }
};

let currentLang = localStorage.getItem('haytool_lang') || 'tr';
let currentTheme = localStorage.getItem('haytool_theme') || 'dark';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  localStorage.setItem('haytool_theme', theme);
}

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('haytool_lang', lang);
  const t = translations[lang] || translations.tr;

  document.getElementById('langFlag').textContent = t.flag;
  document.getElementById('langLabel').textContent = t.label;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLang(currentLang);

  // Theme Toggle
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // Lang Picker
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('hidden');
    });

    document.querySelectorAll('.lang-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const lang = item.getAttribute('data-lang');
        applyLang(lang);
        langDropdown.classList.add('hidden');
      });
    });

    document.addEventListener('click', () => {
      langDropdown.classList.add('hidden');
    });
  }
});