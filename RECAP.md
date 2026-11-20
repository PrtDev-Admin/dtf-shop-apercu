# Refonte dtf-shop.fr pour ATARAXIE — récap

Dernière mise à jour : 20 novembre 2026

Refonte du site PrestaShop dtf-shop.fr (thème Warehouse) pour la sortie de l'album ATARAXIE de D.T.F.
Référence de style : sdmocho.store.

**État : tout le travail est sur une copie locale. Rien n'est en ligne sur dtf-shop.fr.**

## Où est quoi

| Quoi | Où |
|---|---|
| Site refait, à consulter | https://prtdev-admin.github.io/dtf-shop-apercu/ |
| Intro seule (première maquette) | https://prtdev-admin.github.io/dtf-ataraxie-maquette/ |
| Sauvegarde du travail (privé) | https://github.com/PrtDev-Admin/dtf-shop-ataraxie |
| Site local sur le Mac | `~/Sites/dtfshop.fr/` |
| Fichiers copiés du serveur (thème, modules) | `~/Sites/dtfshop.fr/serveur/www/` — hors dépôt |
| Photos produit transparentes (sources) | `/Volumes/SSD SAVE/Bm Concept/ARTISTE CLICLI/DTF/2026/SITE V2 ATARAXIE/` |
| Première maquette de l'intro | `~/Desktop/DTF_site_ATARAXIE/` |

Le lien de consultation est public mais non référencé par Google. C'est une copie figée : on ne peut ni commander, ni se connecter, ni modifier le panier.

## Ce qui est fait

**Accueil**
- Intro animée au défilement : gros plan sur le rebord avec le lettrage ATARAXIE et « Nouvel album », le papillon arrive et se pose, dézoom sur la pochette entière, temps d'arrêt.
- Eau et nuages animés, fumée de cigarette, halo de la planète, néon du logo.
- Logo D.T.F du sol masqué jusqu'à ce que la pochette soit entière.
- Anciennes bannières (Piccolo, Terminator, Karma) retirées.
- Bloc album (pochette, texte, bouton « Précommander ») puis boutique en cartes.

**Tout le site**
- Menu transparent fixe : D.T.F, pilule en verre avec les 5 catégories, Compte, Panier.
- Fond nuit et couleurs de la pochette sur les 30 pages.
- Pied de page : bandes violette et bleu nuit, vidéo « Suivez DTF » conservée.

**Panier**
- Page panier : articles en cartes, récapitulatif qui reste visible, bouton « Commander ».
- Mini panier qui glisse depuis la droite au clic sur « Panier ».

**Fiches produit**
- Composition façon sdmocho : titre, prix, description, tailles en bandeau fin, quantité avec flèches, grand bouton d'ajout au panier.
- Flèches de la galerie et bouton de zoom ronds.

**Pages catégorie**
- Contenu centré, nom de catégorie plus petit, 2 produits par ligne, barre de tri retirée.

**Ruptures de stock**
- Label « Épuisé » sur les cartes des produits sans aucun stock (photo estompée), pastille et bouton gris « Épuisé » sur la fiche.
- Si seule la taille affichée manque, la fiche indique « Taille épuisée ».

**Photos produit**
- 18 photos remplacées par les versions sur fond transparent ; la seconde photo remplace la première au survol.

## To do

### Mise en forme
- [ ] Version mobile de tout le site (menu, intro, panier, fiches produit, catégories)
- [ ] Pages compte, connexion, inscription, mot de passe oublié
- [ ] Pages d'information : CGV, mentions légales, confidentialité, à propos, contact
- [ ] Tunnel de commande (livraison, paiement, confirmation) — pas encore copié
- [ ] Vérifier une fiche produit sans tailles (CD)
- [ ] Sur le vrai site : poser le label « Épuisé » d'après le stock total du produit (le thème ne distingue pas « tout épuisé » de « une taille épuisée » dans les listes)
- [ ] Décider si on ajoute un halo clair derrière les vêtements noirs, peu lisibles sur le fond nuit

### Contenus à fournir
- [ ] Texte de présentation de l'album, formats, prix, date de sortie
- [ ] Lien ou produit pour le bouton « Précommander »
- [ ] Photo transparente du Tee Shirt Classic (la seule encore sur fond blanc)
- [ ] Logo D.T.F en PNG transparent ou SVG pour le menu (actuellement en texte)
- [ ] Liens streaming, clip, dates de tournée, s'il y en a

### Sur le vrai site (back-office)
- [ ] Corriger le menu : « Survêtements » pointe vers Accessoires, « Packs » est en double
- [ ] Corriger ou retirer le lien « Livraison », qui mène à une page introuvable
- [ ] Supprimer le panier visiteur de test (2 articles, créé le 19/11)

### Mise en ligne
- [ ] Sauvegarde complète du site et de la base avant toute modification
- [ ] Transposer la refonte dans le vrai thème Warehouse (gabarits, styles, scripts)
- [ ] Réimporter les photos produit en PNG ou WebP et vérifier que PrestaShop garde la transparence
- [ ] Tester sur le vrai site : ajout au panier, mini panier, commande, paiement
- [ ] Tester sur de vrais téléphones (iPhone et Android)
- [ ] Mettre en ligne

### Ménage
- [ ] Supprimer le dépôt GitHub `prtdev-admin.github.io` (créé par erreur à la racine du compte)
- [ ] Changer le mot de passe FTP chez IONOS (il est passé en clair dans une conversation)
- [ ] Décider du sort du dossier `clickandbuilds/DtfShop` sur le serveur, qui ne semble pas servir
- [ ] Après la sortie : supprimer les dépôts d'aperçu publics

## Décisions prises (à ne pas refaire)

- Rester fidèle à la pochette : pas d'étoiles ni d'étoile filante ajoutées, pas de détourage des personnages, pas d'inclinaison ni de relief 3D.
- Eau : vagues droites, parallèles à l'horizon.
- Catégories : garder la taille d'origine des photos, 2 par ligne.
- Garder la vidéo du bandeau « Suivez DTF ».
- « La Hass avant le Bonheur » n'est pas ajoutée au catalogue.
- Liens d'aperçu en sous-dossier, jamais à la racine du compte GitHub.

## Reprendre le travail

Aperçu local :

```bash
cd ~/Sites/dtfshop.fr && python3 -m http.server 8767
```

Puis ouvrir http://localhost:8767/

Après une modification dans `ataraxie/` :

```bash
cd ~/Sites/dtfshop.fr && python3 ataraxie/construire.py
```

Remplacer une photo produit (numéro d'image, puis fichier) :

```bash
cd ~/Sites/dtfshop.fr && python3 ataraxie/remplacer_image.py 15 ~/Desktop/tee-classic.png
```

Le lien de consultation ne se met pas à jour tout seul : il faut republier après chaque série de retouches.

## Accès serveur

- Hébergeur IONOS, SFTP uniquement (le FTP classique est désactivé).
- Site en ligne : dossier `clickandbuilds/www`.
- Identifiants enregistrés dans `~/.netrc` sur le Mac ; ils ne figurent pas dans ce dépôt.
