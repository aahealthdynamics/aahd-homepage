// ==================== Translations (EN main / JA sub / FR sub) ====================
// Every user-visible string on index.html lives here. Keys are referenced via
// data-i18n (textContent), data-i18n-html (innerHTML, for <br>) and
// data-i18n-attr="attr:key;attr:key" (attributes such as href / placeholder).
//
// English copy is the original Kenya-site messaging, kept as is wherever
// possible. Japanese and French are translations of that copy.

const CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyV5eKQQ5IK_w27WAOJ9PoOFaNPJFC78U6zD3XY4aeXa7Whn8CigC765TWgBBbX0_7O/exec';

const I18N = {
  en: {
    meta_title: 'Africa Asia Health Dynamics Limited | Medical Training & Medical Equipment Financing in Kenya',
    meta_desc: 'Africa Asia Health Dynamics Limited bridges the healthcare gap between Asia and Africa with expert medical training, flexible medical equipment financing and medical device registration support in Kenya. Nairobi-based subsidiary of AA Health Dynamics Inc. (Tokyo).',
    skip: 'Skip to content',

    nav_home: 'Home', nav_about: 'About', nav_services: 'Services', nav_news: 'News', nav_contact: 'Contact',

    hero_eyebrow: 'The Precision of Asia. The Potential of Africa.',
    hero_title: 'Empowering Excellence in Healthcare',
    hero_sub: 'Bridging the precision of Japan with the potential of Africa — through world-class medical training, flexible equipment financing solutions, and medical device registration support.',
    hero_trust: 'Trusted by 500+ clinics and leading medical professionals globally.',
    hero_cta1: 'Explore Our Programs', hero_cta2: 'Consult with Us',

    about_label: 'About', about_title: 'About Us',
    about_intro: 'We are a specialized consulting firm dedicated to bridging the healthcare gap between Asia and Africa. We provide expert medical training, facilitate financing for essential medical equipment and devices, and support the registration of medical devices in Kenya.',
    about_sub: 'Africa Asia Health Dynamics Limited is the Kenyan subsidiary of AA Health Dynamics Inc. (Tokyo), with our team based in Nairobi.',
    mission_title: 'Our Mission', mission_text: 'Resolving local medical issues by empowering local medical workers.',
    vision_title: 'Our Vision', vision_text: 'Continuing to take on emerging countries as a business development professional.',
    values_title: 'Our Core Values',
    cv_1: 'Try and Error then Again', cv_2: "Always confront society's negatives", cv_3: 'Keep moving to keep changing',

    team_label: 'Team', team_title: 'Meet Our Team',
    team1_name: 'Kenta Hara', team1_role: 'CEO', team1_bio: 'Specializing in strategy and international partnerships.',
    team2_name: 'Esther Mugo', team2_role: 'Director, Medical Education', team2_bio: 'Facilitates running medical training programs.',
    team3_name: 'Sharon Mwendwa', team3_role: 'Executive Program Assistant', team3_bio: 'Assisting in program and project management.',

    partners_label: 'Partners', partners_title: 'Our Partners',

    svc_label: 'Services', svc_title: 'Our Core Services',
    s1_title: 'Expert Medical Trainings', s1_text: 'Enhance your medical skills with our expert training programs.', s1_cta: 'View Programs & Webinars',
    news_cat_press: 'Press Release', news_cat_event: 'Event', news_cat_partnership: 'Partnership', news_cat_public: 'Public Project', news_cat_media: 'Media', news_cat_other: 'News',
    s2_title: 'Medical Equipment Financing', s2_text: 'Get financing to procure medical equipment.', s2_cta: 'Learn More & Get Quotation', s2_href: 'https://med-device-frontend.onrender.com/apply',
    s3_title: 'Medical Device Registration Support', s3_text: 'Support for registering medical devices in Kenya. Healthcare business research and consulting support are also available.', s3_cta: 'Book a Consultation',

    news_label: 'News', news_title: 'News & Collaborative Stories',
    news_read_more: 'Read More', news_more: 'More news', news_more_href: 'https://aa-healthdynamics.com/en/news.html',
    news_lang_ja: 'JA', news_empty: 'No news yet.',
    news_cat_training: 'Training', news_cat_finance: 'Finance',
    news_page_meta_title: 'News | Africa Asia Health Dynamics Limited',
    news_page_title: 'News', news_page_intro: 'Updates from Africa Asia Health Dynamics Limited: training programs, equipment financing and partnerships in Kenya.',
    news_back: 'Back to News', news_not_found: 'Article not found.', news_loading: 'Loading…',

    stat1_num: '10+', stat1_lbl: 'Partners',
    stat2_num: '500+', stat2_lbl: 'Medical Professionals Trained',
    stat3_num: '20+', stat3_lbl: 'Businesses Consulted',

    contact_label: 'Contact', contact_title: 'Contact Us',
    contact_text: "We'd love to hear from you. Reach out with any questions or to start a project.",
    f_name: 'Name', f_email: 'Email', f_subject: 'Subject', f_message: 'Message',
    f_ph_name: 'Your Name', f_ph_email: 'Your Email', f_ph_subject: 'Subject', f_ph_message: 'Message',
    f_submit: 'Send Message', f_sending: 'Sending…',
    f_invalid: 'Please fill in all fields with a valid email address.',
    f_success: 'Message sent successfully! We will get back to you shortly.',
    f_error: 'There was an error submitting your message. Please email us directly at info@aa-healthdynamics.com.',
    info_title: 'Get in Touch',
    info_address: 'Address', info_address_text: 'Jade Residency, Kindaruma Road, Kilimani, Nairobi',
    info_phone: 'Phone', info_email: 'Email',
    info_hq: 'Head Office (Tokyo)', info_hq_text: 'AA Health Dynamics Inc.', info_hq_link: 'Visit the Japan site',
    follow_title: 'Follow Us',

    footer_brand: 'Africa Asia Health Dynamics Limited', footer_sub: 'A subsidiary of AA Health Dynamics Inc.',
    footer_quick: 'Quick Links', fl_about: 'About Us', fl_services: 'Services', fl_contact: 'Contact', footer_jp: 'Japan Site',
    footer_services: 'Our Services', fs_1: 'Medical Trainings', fs_2: 'Equipment Financing', fs_3: 'Device Registration Support',
    footer_copy: 'Africa Asia Health Dynamics Limited'
  },

  ja: {
    meta_title: 'Africa Asia Health Dynamics Limited | ケニアの医療トレーニング・医療機器ファイナンス',
    meta_desc: 'Africa Asia Health Dynamics Limitedは、専門的な医療トレーニング、柔軟な医療機器ファイナンス、ケニアでの医療機器登録支援を通じて、アジアとアフリカの医療格差を埋めます。AA Health Dynamics株式会社（東京）のナイロビ子会社。',
    skip: '本文へスキップ',

    nav_home: 'ホーム', nav_about: '会社概要', nav_services: 'サービス', nav_news: 'ニュース', nav_contact: 'お問い合わせ',

    hero_eyebrow: 'アジアの技術力を、アフリカの可能性へ。',
    hero_title: 'アフリカの医療に、<br>確かな力を。',
    hero_sub: '世界水準の医療トレーニング、柔軟な医療機器ファイナンス、医療機器登録支援を通じて、日本の確かな技術とアフリカの可能性をつなぎます。',
    hero_trust: '世界各地の500以上のクリニックと医療専門家に信頼されています。',
    hero_cta1: 'プログラムを見る', hero_cta2: 'ご相談はこちら',

    about_label: 'About', about_title: '私たちについて',
    about_intro: '私たちは、アジアとアフリカの医療格差を埋めることに特化したコンサルティングファームです。専門的な医療トレーニングの提供、必要不可欠な医療機器の調達に向けたファイナンスの支援、ケニアにおける医療機器登録のサポートを行っています。',
    about_sub: 'Africa Asia Health Dynamics Limitedは、AA Health Dynamics株式会社（東京）のケニア子会社で、チームはナイロビに拠点を置いています。',
    mission_title: 'ミッション', mission_text: '現地の医療従事者をエンパワーし、現地の医療課題を解決する。',
    vision_title: 'ビジョン', vision_text: '事業開発のプロフェッショナルとして、新興国に挑み続ける。',
    values_title: 'コアバリュー',
    cv_1: '試して、失敗して、また試す', cv_2: '常に社会の負に向き合う', cv_3: '動き続け、変わり続ける',

    team_label: 'Team', team_title: 'チーム',
    team1_name: '原 健太', team1_role: 'CEO', team1_bio: '戦略立案と国際パートナーシップを専門とする。',
    team2_name: 'Esther Mugo', team2_role: '医療教育ディレクター', team2_bio: '医療研修プログラムの運営を担う。',
    team3_name: 'Sharon Mwendwa', team3_role: 'エグゼクティブ・プログラム・アシスタント', team3_bio: 'プログラム・プロジェクト運営を補佐。',

    partners_label: 'Partners', partners_title: 'パートナー',

    svc_label: 'Services', svc_title: 'コアサービス',
    s1_title: '専門医療トレーニング', s1_text: '専門家による研修プログラムで、医療スキルを高める。', s1_cta: 'プログラム・ウェビナーを見る',
    news_cat_press: 'プレスリリース', news_cat_event: 'イベント', news_cat_partnership: 'パートナーシップ', news_cat_public: '公的事業', news_cat_media: 'メディア', news_cat_other: 'ニュース',
    s2_title: '医療機器ファイナンス', s2_text: '医療機器を調達するためのファイナンスを提供。', s2_cta: '詳細・見積もりはこちら', s2_href: 'https://med-device-frontend.onrender.com/apply',
    s3_title: '医療機器登録支援', s3_text: 'ケニアにおける医療機器登録をサポート。医療ビジネスの調査・コンサルティング支援も承ります。', s3_cta: 'コンサルテーションを予約する',

    news_label: 'News', news_title: 'ニュース & 協働ストーリー',
    news_read_more: '続きを読む', news_more: 'もっと見る', news_more_href: 'https://aa-healthdynamics.com/news.html',
    news_lang_ja: 'JA', news_empty: 'ニュースはまだありません。',
    news_cat_training: '研修', news_cat_finance: 'ファイナンス',
    news_page_meta_title: 'ニュース | Africa Asia Health Dynamics Limited',
    news_page_title: 'ニュース', news_page_intro: 'Africa Asia Health Dynamics Limitedの最新情報。ケニアでの研修プログラム、医療機器ファイナンス、パートナーシップをお届けします。',
    news_back: 'ニュース一覧に戻る', news_not_found: '記事が見つかりませんでした。', news_loading: '読み込み中…',

    stat1_num: '10+', stat1_lbl: 'パートナー',
    stat2_num: '500+', stat2_lbl: '研修を受けた医療専門家',
    stat3_num: '20+', stat3_lbl: '支援した企業',

    contact_label: 'Contact', contact_title: 'お問い合わせ',
    contact_text: 'ご質問やプロジェクトのご相談など、お気軽にご連絡ください。',
    f_name: 'お名前', f_email: 'メールアドレス', f_subject: '件名', f_message: 'お問い合わせ内容',
    f_ph_name: 'お名前', f_ph_email: 'メールアドレス', f_ph_subject: '件名', f_ph_message: 'お問い合わせ内容',
    f_submit: '送信する', f_sending: '送信中…',
    f_invalid: 'すべての項目を入力し、正しいメールアドレスをご記入ください。',
    f_success: '送信ありがとうございます。担当者より折り返しご連絡いたします。',
    f_error: '送信に失敗しました。お手数ですが info@aa-healthdynamics.com まで直接ご連絡ください。',
    info_title: '連絡先',
    info_address: '住所', info_address_text: 'Jade Residency, Kindaruma Road, Kilimani, Nairobi',
    info_phone: '電話', info_email: 'メール',
    info_hq: '本社（東京）', info_hq_text: 'AA Health Dynamics株式会社', info_hq_link: '日本サイトを見る',
    follow_title: 'SNS',

    footer_brand: 'Africa Asia Health Dynamics Limited', footer_sub: 'AA Health Dynamics株式会社のケニア子会社',
    footer_quick: 'クイックリンク', fl_about: '私たちについて', fl_services: 'サービス', fl_contact: 'お問い合わせ', footer_jp: '日本サイト',
    footer_services: 'サービス', fs_1: '医療トレーニング', fs_2: '医療機器ファイナンス', fs_3: '医療機器登録支援',
    footer_copy: 'Africa Asia Health Dynamics Limited'
  },

  fr: {
    meta_title: "Africa Asia Health Dynamics Limited | Formation médicale et financement d'équipements médicaux au Kenya",
    meta_desc: "Africa Asia Health Dynamics Limited comble l'écart de santé entre l'Asie et l'Afrique grâce à des formations médicales expertes, un financement flexible d'équipements médicaux et un accompagnement à l'enregistrement des dispositifs médicaux au Kenya. Filiale de AA Health Dynamics Inc. (Tokyo), basée à Nairobi.",
    skip: 'Aller au contenu',

    nav_home: 'Accueil', nav_about: 'À propos', nav_services: 'Services', nav_news: 'Actualités', nav_contact: 'Contact',

    hero_eyebrow: "La précision de l'Asie. Le potentiel de l'Afrique.",
    hero_title: "L'excellence au service<br>de la santé",
    hero_sub: "Relier la précision du Japon au potentiel de l'Afrique — par des formations médicales de classe mondiale, des solutions flexibles de financement d'équipements et un accompagnement à l'enregistrement des dispositifs médicaux.",
    hero_trust: 'La confiance de plus de 500 cliniques et de professionnels de santé de premier plan dans le monde.',
    hero_cta1: 'Découvrir nos programmes', hero_cta2: 'Nous consulter',

    about_label: 'À propos', about_title: 'Qui sommes-nous',
    about_intro: "Nous sommes un cabinet de conseil spécialisé, dédié à combler l'écart de santé entre l'Asie et l'Afrique. Nous proposons des formations médicales expertes, facilitons le financement des équipements et dispositifs médicaux essentiels, et accompagnons l'enregistrement des dispositifs médicaux au Kenya.",
    about_sub: 'Africa Asia Health Dynamics Limited est la filiale kényane de AA Health Dynamics Inc. (Tokyo) ; notre équipe est basée à Nairobi.',
    mission_title: 'Notre mission', mission_text: 'Résoudre les problèmes de santé locaux en donnant les moyens d’agir aux soignants locaux.',
    vision_title: 'Notre vision', vision_text: 'Continuer à relever le défi des pays émergents en tant que professionnels du développement d’activités.',
    values_title: 'Nos valeurs',
    cv_1: 'Essayer, se tromper, recommencer', cv_2: 'Toujours affronter les maux de la société', cv_3: 'Continuer d’avancer pour continuer de changer',

    team_label: 'Équipe', team_title: 'Notre équipe',
    team1_name: 'Kenta Hara', team1_role: 'CEO', team1_bio: 'Spécialiste de la stratégie et des partenariats internationaux.',
    team2_name: 'Esther Mugo', team2_role: 'Directrice, Formation médicale', team2_bio: 'Assure la mise en œuvre des programmes de formation médicale.',
    team3_name: 'Sharon Mwendwa', team3_role: 'Assistante exécutive de programme', team3_bio: 'Assiste la gestion des programmes et des projets.',

    partners_label: 'Partenaires', partners_title: 'Nos partenaires',

    svc_label: 'Services', svc_title: 'Nos services',
    s1_title: 'Formations médicales expertes', s1_text: 'Développez vos compétences médicales grâce à nos programmes de formation experts.', s1_cta: 'Voir les programmes et webinaires',
    news_cat_press: 'Communiqué', news_cat_event: 'Événement', news_cat_partnership: 'Partenariat', news_cat_public: 'Projet public', news_cat_media: 'Médias', news_cat_other: 'Actualité',
    s2_title: "Financement d'équipements médicaux", s2_text: 'Obtenez un financement pour acquérir des équipements médicaux.', s2_cta: 'En savoir plus et devis', s2_href: 'https://med-device-frontend.onrender.com/apply',
    s3_title: 'Enregistrement des dispositifs médicaux', s3_text: "Accompagnement pour l'enregistrement des dispositifs médicaux au Kenya. Études de marché et conseil en santé également disponibles.", s3_cta: 'Réserver une consultation',

    news_label: 'Actualités', news_title: 'Actualités et projets collaboratifs',
    news_read_more: 'Lire la suite', news_more: "Plus d'actualités", news_more_href: 'https://aa-healthdynamics.com/en/news.html',
    news_lang_ja: 'JA', news_empty: 'Aucune actualité pour le moment.',
    news_cat_training: 'Formation', news_cat_finance: 'Financement',
    news_page_meta_title: 'Actualités | Africa Asia Health Dynamics Limited',
    news_page_title: 'Actualités', news_page_intro: "Les dernières nouvelles d'Africa Asia Health Dynamics Limited : programmes de formation, financement d'équipements et partenariats au Kenya.",
    news_back: 'Retour aux actualités', news_not_found: 'Article introuvable.', news_loading: 'Chargement…',

    stat1_num: '10+', stat1_lbl: 'Partenaires',
    stat2_num: '500+', stat2_lbl: 'Professionnels de santé formés',
    stat3_num: '20+', stat3_lbl: 'Entreprises accompagnées',

    contact_label: 'Contact', contact_title: 'Contactez-nous',
    contact_text: 'Nous serions ravis de vous lire. Contactez-nous pour toute question ou pour lancer un projet.',
    f_name: 'Nom', f_email: 'E-mail', f_subject: 'Objet', f_message: 'Message',
    f_ph_name: 'Votre nom', f_ph_email: 'Votre e-mail', f_ph_subject: 'Objet', f_ph_message: 'Message',
    f_submit: 'Envoyer', f_sending: 'Envoi…',
    f_invalid: 'Veuillez remplir tous les champs avec une adresse e-mail valide.',
    f_success: 'Message envoyé ! Nous vous répondrons rapidement.',
    f_error: "Une erreur s'est produite lors de l'envoi. Écrivez-nous directement à info@aa-healthdynamics.com.",
    info_title: 'Restons en contact',
    info_address: 'Adresse', info_address_text: 'Jade Residency, Kindaruma Road, Kilimani, Nairobi',
    info_phone: 'Téléphone', info_email: 'E-mail',
    info_hq: 'Siège (Tokyo)', info_hq_text: 'AA Health Dynamics Inc.', info_hq_link: 'Voir le site japonais',
    follow_title: 'Suivez-nous',

    footer_brand: 'Africa Asia Health Dynamics Limited', footer_sub: 'Filiale de AA Health Dynamics Inc.',
    footer_quick: 'Liens rapides', fl_about: 'À propos', fl_services: 'Services', fl_contact: 'Contact', footer_jp: 'Site Japon',
    footer_services: 'Nos services', fs_1: 'Formations médicales', fs_2: "Financement d'équipements", fs_3: 'Enregistrement des dispositifs',
    footer_copy: 'Africa Asia Health Dynamics Limited'
  }
};
