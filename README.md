# Site web – Bourbaki64 (espaces verts & toiture)

Site vitrine statique (HTML/CSS/JS, sans dépendance) pour un auto-entrepreneur en espaces verts et travaux de toiture.

## Structure

```
index.html           Accueil (présentation + les 2 services)
espaces-verts.html   Service 1 : espaces verts
toiture.html         Service 2 : travaux de toiture
contact.html         Coordonnées + formulaire de demande de devis
css/style.css        Styles (couleurs modifiables en haut du fichier)
js/main.js           Menu mobile + formulaire de contact
```

## À personnaliser

Remplacer dans tous les fichiers HTML (rechercher/remplacer) :

- `Bourbaki64` / `Vert <span>&amp;</span> Toit` → nom de l'entreprise
- `06 39 98 64 64` et `+33639986464` (numéro fictif) → numéro de téléphone
- `contact@bourbaki64.fr` → adresse e-mail (aussi dans `js/main.js`)
- `Pau et 15 km alentour` → zone d'intervention
- `SIRET : 912 345 678 00014` (fictif) → numéro SIRET

## Formulaire de contact

Le formulaire ouvre la messagerie du visiteur avec la demande pré-remplie (fonctionne sans serveur).
Pour un envoi direct, on peut le brancher sur un service comme Formspree ou Netlify Forms.

## Mise en ligne

Ouvrir `index.html` dans un navigateur pour tester. Hébergement possible gratuitement via GitHub Pages
(Settings → Pages → branche à publier).
