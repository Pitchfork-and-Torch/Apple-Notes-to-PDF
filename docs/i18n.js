/* Landing page UI strings — progressive i18n */
(function (global) {
  var en = {
    brand: "Apple Notes to PDF",
    nav_features: "Features",
    nav_how: "How it works",
    nav_compare: "Compare",
    nav_faq: "FAQ",
    nav_download: "Download",
    eyebrow: "v7.0.0 · MIT · 100% local",
    hero_title: "Export Apple Notes to PDF, Markdown & HTML — privately",
    hero_lede: "The free, open-source bulk exporter for Notes.app. Searchable master PDF, per-note files, Obsidian-ready Markdown, attachments, folder hierarchy — all on your Mac. No cloud. No telemetry. No account.",
    cta_download: "Download v7.0.0",
    cta_github: "View on GitHub",
    hero_fine: "macOS 12+ · Automation permission only for core export · Full Disk Access optional for attachments",
    feat_title: "Built for privacy, fidelity, and archives",
    f1t: "100% local", f1d: "No upload, no account, no telemetry. Your notes never leave the machine during export.",
    f2t: "Searchable PDF", f2d: "Master PDF plus optional per-note PDFs with styled layout and readable text.",
    f3t: "Markdown for Obsidian", f3d: "YAML frontmatter, GFM checklists, relative image links — drop into your vault.",
    f4t: "Folder hierarchy", f4d: "Mirrors accounts and folders on disk. Filter with --folder and --account.",
    f5t: "Attachments", f5d: "Images, documents, audio, and video extracted into organized folders.",
    f6t: "Incremental export", f6d: "Skip unchanged notes using modification dates and a local state file.",
    f7t: "Zero third-party deps", f7d: "zsh + JXA + AppleScript + AppKit. Easy to audit. No Electron.",
    f8t: "HTML archive", f8d: "master.html with TOC, search, dark mode, and print-friendly CSS.",
    how_title: "Three steps to a permanent backup",
    h1t: "Download", h1d: "Get the release zip. Keep the script, lib/, and renderer together.",
    h2t: "Allow Automation", h2d: "System Settings → Privacy & Security → Automation → Notes.",
    h3t: "Export", h3d: "Double-click the app or run ./export-apple-notes.sh. Open the Desktop folder.",
    cmp_title: "How it compares",
    cmp_c0: "Capability", cmp_c2: "Paid apps", cmp_c3: "Other OSS",
    cmp_r1: "Price", cmp_paid: "Paid",
    cmp_r2: "No cloud / no account",
    cmp_r3: "Shell-auditable sources",
    cmp_r4: "PDF + MD + HTML + JSON",
    cmp_r5: "Incremental",
    cmp_r6: "Telemetry-free by design",
    faq_title: "FAQ",
    faq1q: "Does this upload my notes to the cloud?",
    faq1a: "No. Everything runs on your Mac. See SECURITY.md in the repository.",
    faq2q: "Can I export Apple Notes to Markdown for Obsidian?",
    faq2a: "Yes. Use --format md (or all). Files include YAML frontmatter and relative links to extracted images.",
    faq3q: "Do I need Full Disk Access?",
    faq3a: "Not for core text/HTML export. It can improve attachment recovery from the Notes media store.",
    faq4q: "What about locked notes?",
    faq4a: "Locked notes that Automation cannot read are skipped and listed in skipped.json.",
    faq5q: "Is iCloud supported?",
    faq5a: "Yes for notes already synced into Notes.app on the Mac. The tool does not call iCloud APIs.",
    final_title: "Own your notes archive",
    final_lede: "Free forever. Open source. Built for people who refuse to lock knowledge in a single app.",
    footer_privacy: "No trackers on this page. Privacy-friendly by design."
  };

  function copy(base, over) {
    var o = {};
    for (var k in base) o[k] = base[k];
    for (var k2 in over) o[k2] = over[k2];
    return o;
  }

  var dict = {
    en: en,
    es: copy(en, {
      nav_features: "Funciones", nav_how: "Cómo funciona", nav_compare: "Comparar", nav_faq: "FAQ", nav_download: "Descargar",
      hero_title: "Exporta Apple Notes a PDF, Markdown y HTML — en privado",
      hero_lede: "El exportador masivo gratuito y de código abierto para Notes.app. PDF maestro, Markdown para Obsidian, adjuntos y jerarquía de carpetas — todo en tu Mac. Sin nube. Sin telemetría.",
      cta_download: "Descargar v7.0.0", cta_github: "Ver en GitHub",
      feat_title: "Privacidad, fidelidad y archivo",
      how_title: "Tres pasos para un respaldo permanente",
      cmp_title: "Comparación", faq_title: "Preguntas frecuentes",
      faq1q: "¿Sube mis notas a la nube?", faq1a: "No. Todo se ejecuta en tu Mac.",
      final_title: "Sé dueño de tu archivo de notas",
      final_lede: "Gratis para siempre. Código abierto. Sin encerrar tu conocimiento en una sola app.",
      footer_privacy: "Sin rastreadores en esta página."
    }),
    fr: copy(en, {
      nav_features: "Fonctionnalités", nav_how: "Fonctionnement", nav_compare: "Comparer", nav_faq: "FAQ", nav_download: "Télécharger",
      hero_title: "Exportez Apple Notes en PDF, Markdown et HTML — en local",
      hero_lede: "L’exportateur libre pour Notes.app. PDF consultable, Markdown Obsidian, pièces jointes, hiérarchie — 100 % sur votre Mac. Sans cloud ni télémétrie.",
      cta_download: "Télécharger v7.0.0",
      feat_title: "Confidentialité, fidélité, archives",
      how_title: "Trois étapes pour une sauvegarde durable",
      cmp_title: "Comparaison", faq_title: "FAQ",
      faq1q: "Mes notes sont-elles envoyées dans le cloud ?", faq1a: "Non. Tout s’exécute sur votre Mac.",
      final_title: "Possédez vos archives de notes",
      footer_privacy: "Aucun tracker sur cette page."
    }),
    de: copy(en, {
      nav_features: "Funktionen", nav_how: "So geht’s", nav_compare: "Vergleich", nav_faq: "FAQ", nav_download: "Download",
      hero_title: "Apple Notes nach PDF, Markdown & HTML exportieren — lokal",
      hero_lede: "Der kostenlose Open-Source-Bulk-Export für Notes.app. Master-PDF, Obsidian-Markdown, Anhänge, Ordnerstruktur — alles auf dem Mac. Keine Cloud. Keine Telemetrie.",
      cta_download: "v7.0.0 herunterladen",
      feat_title: "Privatsphäre, Treue, Archiv",
      how_title: "Drei Schritte zum dauerhaften Backup",
      cmp_title: "Vergleich", faq_title: "Häufige Fragen",
      faq1q: "Werden meine Notizen in die Cloud hochgeladen?", faq1a: "Nein. Alles läuft lokal auf dem Mac.",
      final_title: "Besitze dein Notizarchiv",
      footer_privacy: "Keine Tracker auf dieser Seite."
    }),
    ja: copy(en, {
      nav_features: "機能", nav_how: "使い方", nav_compare: "比較", nav_faq: "FAQ", nav_download: "ダウンロード",
      hero_title: "Apple Notes を PDF・Markdown・HTML に非公開エクスポート",
      hero_lede: "Notes.app 向けの無料オープンソース一括エクスポーター。マスターPDF、Obsidian 向け Markdown、添付ファイル、フォルダ階層 — すべて Mac 上。クラウドなし。テレメトリなし。",
      cta_download: "v7.0.0 をダウンロード",
      feat_title: "プライバシー・忠実性・アーカイブ",
      how_title: "永続バックアップまでの 3 ステップ",
      cmp_title: "比較", faq_title: "よくある質問",
      faq1q: "ノートはクラウドにアップロードされますか？", faq1a: "いいえ。すべて Mac 上で動作します。",
      final_title: "ノートのアーカイブを自分で所有する",
      footer_privacy: "このページにトラッカーはありません。"
    }),
    "zh-CN": copy(en, {
      nav_features: "功能", nav_how: "如何使用", nav_compare: "对比", nav_faq: "常见问题", nav_download: "下载",
      hero_title: "将 Apple 备忘录导出为 PDF、Markdown 与 HTML — 完全本地",
      hero_lede: "免费开源的 Notes.app 批量导出工具。可搜索主 PDF、Obsidian 友好 Markdown、附件与文件夹层级 — 全部在 Mac 上完成。无云端。无遥测。",
      cta_download: "下载 v7.0.0",
      feat_title: "为隐私、保真与归档而设计",
      how_title: "三步完成永久备份",
      cmp_title: "对比", faq_title: "常见问题",
      faq1q: "会把我的备忘录上传到云端吗？", faq1a: "不会。全部在 Mac 本地运行。",
      final_title: "掌控你的备忘录归档",
      footer_privacy: "本页无跟踪器。"
    }),
    pt: copy(en, {
      nav_features: "Recursos", nav_how: "Como funciona", nav_compare: "Comparar", nav_faq: "FAQ", nav_download: "Baixar",
      hero_title: "Exporte Apple Notes para PDF, Markdown e HTML — localmente",
      hero_lede: "Exportador em massa gratuito e open source para o Notes.app. PDF mestre, Markdown para Obsidian, anexos e hierarquia — tudo no seu Mac. Sem nuvem. Sem telemetria.",
      cta_download: "Baixar v7.0.0",
      feat_title: "Privacidade, fidelidade e arquivo",
      how_title: "Três passos para um backup permanente",
      cmp_title: "Comparação", faq_title: "Perguntas frequentes",
      faq1q: "Isto envia as minhas notas para a nuvem?", faq1a: "Não. Tudo corre no seu Mac.",
      final_title: "Seja dono do arquivo das suas notas",
      footer_privacy: "Sem trackers nesta página."
    }),
    ko: copy(en, {
      nav_features: "기능", nav_how: "사용 방법", nav_compare: "비교", nav_faq: "FAQ", nav_download: "다운로드",
      hero_title: "Apple Notes를 PDF·Markdown·HTML로 로컬 내보내기",
      hero_lede: "Notes.app용 무료 오픈소스 일괄 내보내기. 검색 가능한 마스터 PDF, Obsidian용 Markdown, 첨부파일, 폴더 구조 — 모두 Mac에서. 클라우드 없음. 텔레메트리 없음.",
      cta_download: "v7.0.0 다운로드",
      feat_title: "프라이버시·충실도·아카이브",
      how_title: "영구 백업까지 3단계",
      cmp_title: "비교", faq_title: "자주 묻는 질문",
      faq1q: "노트가 클라우드에 업로드되나요?", faq1a: "아니요. 모두 Mac에서 실행됩니다.",
      final_title: "노트 아카이브를 직접 소유하세요",
      footer_privacy: "이 페이지에는 추적기가 없습니다."
    }),
    it: copy(en, {
      nav_features: "Funzioni", nav_how: "Come funziona", nav_compare: "Confronta", nav_faq: "FAQ", nav_download: "Scarica",
      hero_title: "Esporta Apple Notes in PDF, Markdown e HTML — in locale",
      hero_lede: "L’esportatore open source gratuito per Notes.app. PDF master, Markdown per Obsidian, allegati e gerarchia cartelle — tutto sul Mac. Niente cloud. Niente telemetria.",
      cta_download: "Scarica v7.0.0",
      feat_title: "Privacy, fedeltà e archivio",
      how_title: "Tre passi per un backup permanente",
      cmp_title: "Confronto", faq_title: "Domande frequenti",
      faq1q: "Carica le mie note sul cloud?", faq1a: "No. Tutto gira sul tuo Mac.",
      final_title: "Possiedi l’archivio delle tue note",
      footer_privacy: "Nessun tracker in questa pagina."
    }),
    ru: copy(en, {
      nav_features: "Возможности", nav_how: "Как это работает", nav_compare: "Сравнение", nav_faq: "FAQ", nav_download: "Скачать",
      hero_title: "Экспорт Apple Notes в PDF, Markdown и HTML — локально",
      hero_lede: "Бесплатный open-source экспортёр Notes.app. Мастер-PDF, Markdown для Obsidian, вложения и иерархия папок — всё на Mac. Без облака. Без телеметрии.",
      cta_download: "Скачать v7.0.0",
      feat_title: "Приватность, точность, архив",
      how_title: "Три шага к постоянному бэкапу",
      cmp_title: "Сравнение", faq_title: "Частые вопросы",
      faq1q: "Заметки загружаются в облако?", faq1a: "Нет. Всё работает на вашем Mac.",
      final_title: "Владейте архивом заметок",
      footer_privacy: "На этой странице нет трекеров."
    })
  };

  function apply(lang) {
    var d = dict[lang] || dict.en;
    document.documentElement.lang = lang === "zh-CN" ? "zh-CN" : lang;
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      if (d[key] != null) nodes[i].textContent = d[key];
    }
  }

  global.ANTP_I18N = { apply: apply, dict: dict };
})(typeof window !== "undefined" ? window : globalThis);
