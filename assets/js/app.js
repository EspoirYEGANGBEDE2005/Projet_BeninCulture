const formInscription = document.getElementById("formInscription");

if (formInscription) {
    formInscription.addEventListener("submit", function (event) {
        event.preventDefault();

        const nom = document.getElementById("nom").value.trim();
        const prenom = document.getElementById("prenom").value.trim();
        const email = document.getElementById("email").value.trim();
        const pays = document.getElementById("pays").value.trim();
        const motdepasse = document.getElementById("motdepasse").value.trim();
        const avis = document.getElementById("avis").value.trim();
        let isValid = true;

        document.querySelectorAll(".error-message").forEach(function (message) {
            message.textContent = "";
        });

        document.getElementById("successMessage").textContent = "";

        if (nom === "") {
            document.getElementById("errorNom").textContent = "Veuillez entrer votre nom.";
            isValid = false;
        }

        if (prenom === "") {
            document.getElementById("errorPrenom").textContent = "Veuillez entrer votre prénom.";
            isValid = false;
        }

        if (email === "") {
            document.getElementById("errorEmail").textContent = "Veuillez entrer votre adresse email.";
            isValid = false;
        } else if (!email.includes("@") || !email.includes(".")) {
            document.getElementById("errorEmail").textContent = "Veuillez entrer une adresse email valide.";
            isValid = false;
        }

        if (pays === "") {
            document.getElementById("errorPays").textContent = "Veuillez entrer votre pays ou nationalité.";
            isValid = false;
        }

        if (motdepasse === "") {
            document.getElementById("errorMotdepasse").textContent = "Veuillez créer un mot de passe.";
            isValid = false;
        } else if (motdepasse.length < 6) {
            document.getElementById("errorMotdepasse").textContent = "Le mot de passe doit contenir au moins 6 caractères.";
            isValid = false;
        }

        if (isValid) {
            const utilisateur = { nom, prenom, email, pays, motdepasse, avis };
            localStorage.setItem("utilisateurBeninCulture", JSON.stringify(utilisateur));
            localStorage.setItem("utilisateurConnecte", "true");

            document.getElementById("successMessage").textContent =
                "Inscription réussie ! Redirection vers la page Découvrez...";

            formInscription.reset();

            setTimeout(function () {
                window.location.href = "decouvrir.html";
            }, 2000);
        }
    });
}

const formConnexion = document.getElementById("formConnexion");

if (formConnexion) {
    formConnexion.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailConnexion = document.getElementById("emailConnexion").value.trim();
        const motdepasseConnexion = document.getElementById("motdepasseConnexion").value.trim();
        let isValid = true;

        document.getElementById("errorEmailConnexion").textContent = "";
        document.getElementById("errorMotdepasseConnexion").textContent = "";
        document.getElementById("successConnexion").textContent = "";

        if (emailConnexion === "") {
            document.getElementById("errorEmailConnexion").textContent = "Veuillez entrer votre adresse email.";
            isValid = false;
        }

        if (motdepasseConnexion === "") {
            document.getElementById("errorMotdepasseConnexion").textContent = "Veuillez entrer votre mot de passe.";
            isValid = false;
        }

        if (isValid) {
            const utilisateur = JSON.parse(localStorage.getItem("utilisateurBeninCulture"));

            if (utilisateur && utilisateur.email === emailConnexion && utilisateur.motdepasse === motdepasseConnexion) {
                localStorage.setItem("utilisateurConnecte", "true");
                document.getElementById("successConnexion").textContent =
                    "Connexion réussie ! Redirection vers la page Découvrez...";

                setTimeout(function () {
                    window.location.href = "decouvrir.html";
                }, 1500);
            } else {
                document.getElementById("errorMotdepasseConnexion").textContent =
                    "Email ou mot de passe incorrect.";
            }
        }
    });
}

const btnDeconnexion = document.getElementById("btnDeconnexion");

if (btnDeconnexion) {
    btnDeconnexion.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("utilisateurConnecte");
        alert("Vous êtes déconnecté.");

        if (window.location.pathname.includes("/Pages/") || window.location.pathname.includes("/pages/")) {
            window.location.href = "../index.html";
        } else {
            window.location.href = "index.html";
        }
    });
}

const categoryNames = {
    "vodouns.html": "Vodouns du Bénin",
    "royaumes.html": "Royaumes du Bénin",
    "villes.html": "Villes du Bénin",
    "sites.html": "Sites touristiques",
    "musees.html": "Musées du Bénin",
    "danses.html": "Rythmes et danses traditionnelles",
    "masques.html": "Masques du Bénin"
};

function getCurrentPageName() {
    return window.location.pathname.split("/").pop();
}

function initCultureCards() {
    const cards = document.querySelectorAll(".culture-card");
    const pageName = getCurrentPageName();
    const category = categoryNames[pageName];

    if (!cards.length || !category) {
        return;
    }

    cards.forEach(function (card) {
        card.setAttribute("role", "link");
        card.setAttribute("tabindex", "0");

        function openDetails() {
            const title = card.querySelector("h3")?.textContent.trim() || "Élément culturel";
            const description = card.querySelector("p")?.textContent.trim() || "";
            const image = card.querySelector("img")?.getAttribute("src") || "";
            const imageAlt = card.querySelector("img")?.getAttribute("alt") || title;

            localStorage.setItem("beninCultureDetail", JSON.stringify({
                title: title,
                description: description,
                image: image,
                imageAlt: imageAlt,
                category: category,
                sourcePage: pageName
            }));

            window.location.href = `details.html?categorie=${encodeURIComponent(category)}&element=${encodeURIComponent(title)}`;
        }

        card.addEventListener("click", openDetails);
        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openDetails();
            }
        });
    });
}

function initDetailsPage() {
    const titleElement = document.getElementById("detailTitle");
    if (!titleElement) {
        return;
    }

    const detail = JSON.parse(localStorage.getItem("beninCultureDetail") || "{}");
    const params = new URLSearchParams(window.location.search);
    const title = detail.title || params.get("element") || "Élément culturel";
    const category = detail.category || params.get("categorie") || "Découverte culturelle";
    const description = detail.description || "Cet élément fait partie du patrimoine culturel béninois valorisé par BeninCulture.";
    const image = detail.image || "../assets/images/Les sites touristiques/Illustration-Ganvié.jpg";
    const imageAlt = detail.imageAlt || title;

    document.title = `${title} - BeninCulture`;
    titleElement.textContent = title;
    document.getElementById("detailCategory").textContent = category;
    document.getElementById("detailCategoryName").textContent = category;
    document.getElementById("detailSubtitle").textContent = `À propos de ${title}`;
    document.getElementById("detailDescription").textContent = description;
    document.getElementById("detailExtra").textContent =
        `${title} illustre la diversité du patrimoine béninois. Cette fiche permet d’en garder une trace claire avant de poursuivre l’exploration des autres catégories.`;

    const imageElement = document.getElementById("detailImage");
    imageElement.setAttribute("src", image);
    imageElement.setAttribute("alt", imageAlt);
}

initCultureCards();
initDetailsPage();
