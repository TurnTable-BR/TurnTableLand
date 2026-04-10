// Iniciando o sistema;

document.addEventListener("DOMContentLoaded", () => {
    initAnimations();
    initCounters();
    carregarStatusReal();
    setInterval(carregarStatusReal, 30000);
    initTheme();
    initLanguage();
});

// Animações
function initAnimations() {
    if (typeof gsap === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(".stat, .feature-card", { opacity: 0, y: 50 });

    // Stats
    if (document.querySelector(".stats")) {
        gsap.to(".stat", {
            scrollTrigger: {
                trigger: ".stats",
                start: "top 85%",
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });
    }

    // Features
    if (document.querySelector(".features-grid")) {
        gsap.to(".feature-card", {
            scrollTrigger: {
                trigger: ".features-grid",
                start: "top 80%"
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });
    }
    ScrollTrigger.refresh();
}

// Contadores
window.initCounters = function (specificTarget = null) {
    const statsSection = document.querySelector(".stats");
    if (!statsSection) return;

    function formatNumber(num) {
        if (num >= 1000) return Math.floor(num / 1000) + "K+";
        return num.toString();
    }

    function animateSingleCounter(counterEl) {
        const target = +counterEl.getAttribute("data-target");
        let count = 0;
        const increment = target / 100;
        const duration = 1500;
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = 1 - Math.pow(1 - progress, 3);
            count = target * easedProgress;

            if (progress < 1) {
                counterEl.textContent = formatNumber(Math.floor(count));
                requestAnimationFrame(updateCount);
            } else {
                counterEl.textContent = formatNumber(target);
            }
        }
        requestAnimationFrame(updateCount);
    }

    const counters = specificTarget
        ? [document.getElementById(specificTarget)]
        : document.querySelectorAll(".counter");

    counters.forEach(counter => {
        if (counter && counter.getAttribute("data-target") !== null) {
            animateSingleCounter(counter);
        }
    });
};

// Puxando os dados da API
async function carregarStatusReal() {
    try {
        const response = await fetch('https://api.turntable.com.br/api/v1/status');
        const data = await response.json();
        const usuariosEl = document.getElementById('total-usuarios');

        if (usuariosEl) {
            usuariosEl.setAttribute('data-target', data.total_usuarios);
            usuariosEl.textContent = '0';
            window.initCounters('total-usuarios');
        }
    } catch (error) {
        console.error('❌ ERRO COMPLETO:', error);
    }
}

// Tema
function initTheme() {
    const toggleBtn = document.getElementById("theme-toggle");
    const body = document.body;

    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector("i");

    function updateThemeAssets(theme) {
        const logoImg = document.getElementById("logo-img");
        const favicon = document.querySelector("link[rel='icon']");

        if (theme === "light") {
            icon.classList.replace("fa-moon", "fa-sun");
            if (logoImg)
                logoImg.src = "../img/Logo-Preto.png";
            if (favicon)
                favicon.href = "../img/favicon-dark.png";
        } else {
            icon.classList.replace("fa-sun", "fa-moon");
            if (logoImg)
                logoImg.src = "../img/Logo-Branco.png";
            if (favicon)
                favicon.href = "../img/favicon-light.png";
        }
    }

    const savedTheme =
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    body.setAttribute("data-theme", savedTheme);
    updateThemeAssets(savedTheme);
    toggleBtn.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeAssets(newTheme);
    });
}

// Traduções
function initLanguage() {
    const langToggle = document.getElementById("language-toggle");

    if (!langToggle) return;

    const translations = {
        pt: {
            // -- Header --
            nav_about: "Sobre",
            nav_features: "Recursos",
            nav_login: "Entrar",

            // -- Secção de Apresentação de Aplicativo --
            hero_app_name: "TurnTable",
            hero_subtitle: "Conecte-se com pessoas através da música. Onde seu gosto musical cria laços reais.",
            btn_web_version: "Acessar Versão Web",
            mockup_placeholder: "Tela do App (Futuro)",

            // -- Badge --
            badge_text: "Disponível no",
            badge_subtext: "Google Play",

            // -- Secção de Status --
            stats_title: "Nossos Números",
            stats_users: "Usuários",
            stats_mixes: "Músicas Compartilhadas",
            stats_connects: "Conexões Feitas",

            // -- Secção de Recursos --
            features_subtitle: "Recursos Incríveis",
            features_title: "O que você pode fazer",
            discovery_title: "Descobrir Músicas",
            discovery_subtitle: "Nosso algoritmo entende sua vibe e sugere faixas que realmente fazem sentido para o seu momento.",
            connect_title: "Conectar-se",
            connect_subtitle: "Siga amigos e descubra o que pessoas com o gosto musical parecido com o seu estão ouvindo agora.",
            review_title: "Avaliar e Resenhar",
            review_subtitle: "Deixe sua marca. Avalie álbuns e compartilhe suas opiniões com uma comunidade apaixonada.",

            // -- CTA --
            cta_title: "Pronto para sintonizar sua nova rede social?",
            cta_subtitle: "Baixe agora e comece a conectar seu gosto musical com o mundo.",
            cta_button: "Instalar TurnTable",

            // -- Botões --
            btn_home: "Voltar ao TurnTable",
            btn_back: "Voltar",

            // -- Página 404 --
            error_404_title: "Disco não encontrado",
            error_404_desc: "Procuramos essa faixa em toda a coleção do TurnTable, mas ela não apareceu na playlist.",

            // -- Página 403 --
            error_403_title: "Faixa bloqueada",
            error_403_desc: "Este conteúdo está protegido. Você não tem permissão para reproduzir este disco no TurnTable.",

            // -- Página 500 --
            error_500_title: "O toca-discos travou",
            error_500_desc: "Algo deu errado enquanto tentávamos reproduzir esta faixa. Nossa equipe já está ajustando a agulha.",

            // -- Footer --
            footer: "© 2026 TurnTable — Todos os direitos reservados"
        },
        en: {
            // -- Header --
            nav_about: "About",
            nav_features: "Features",
            nav_login: "Login",

            // -- Secção de Apresentação de Aplicativo --
            hero_app_name: "TurnTable",
            hero_subtitle: "Connect with people through music. Where your musical taste creates real bonds.",
            btn_web_version: "Access the Web Version",
            mockup_placeholder: "App Screen (Coming Soon)",

            // -- Badge --
            badge_text: "Available on",
            badge_subtext: "Google Play",

            // -- Secção de Status --
            stats_title: "Our Numbers",
            stats_users: "Active Users Worldwide",
            stats_mixes: "Songs Shared",
            stats_connects: "Connections Made",

            // -- Secção de Recursos --
            features_subtitle: "Amazing Resources",
            features_title: "What can you do?",
            discovery_title: "Discover New Music",
            discovery_subtitle: "Our algorithm understands your vibe and recommends tracks that fit your moment.",
            connect_title: "Connect",
            connect_subtitle: "Follow your friends and discover what people with music tastes similar to yours are listening to right now.",
            review_title: "Rate and Review",
            review_subtitle: "Make your mark. Rate albums and share your opinions with a passionate community of music lovers.",

            // -- CTA --
            cta_title: "Ready to tune in to your new music social network?",
            cta_subtitle: "Download now and start sharing your musical taste with the world!",
            cta_button: "Install TurnTable",

            // -- Botões --
            btn_home: "Return to TurnTable",
            btn_back: "Return",

            // -- Página 404 --
            error_404_title: "This Record Isn’t Spinning",
            error_404_desc: "We looked through the entire TurnTable collection for this track, but couldn’t find it in the playlist.",

            // -- Página 403 --
            error_403_title: "Track Blocked",
            error_403_desc: "This content is protected. You don’t have permission to play this track on TurnTable.",

            // -- Página 500 --
            error_500_title: "The turntable hit a snag.",
            error_500_desc: "Something went wrong while trying to play this track. Our team is already adjusting the needle.",

            // -- Footer --
            footer: "© 2026 TurnTable — All rights reserved"
        }
    };

    function updateLanguage(lang) {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        localStorage.setItem("lang", lang);
    }

    const savedLang = localStorage.getItem("lang") || (navigator.language.startsWith("en") ? "en" : "pt");
    langToggle.value = savedLang;
    updateLanguage(savedLang);

    langToggle.addEventListener("change", (e) => {
        updateLanguage(e.target.value);
    });
}