## Work example

- Titre (Quentin Blake's Box of Treasures)
- Catégorie (TV Show/ Feature Film...)
- Poste (Lead décor couleur / Référence et décors couleur)

- ./img/works/[projectName]/[projectName]_thumbnail.png (560x420 | 4/3)
- ./img/works/[projectName]/[projectName]_1.jpg (width: 1130px)
- ./img/works/[projectName]/[projectName]_2.jpg (width: 1130px)
- ...

## Create project exemple files
`mkdir ./img/works/[projectName]; touch ./img/works/[projectName]/[projectName]_thumbnail.jpg ./img/works/[projectName]/[projectName]_1.jpg; cp ./templates/page/works/lastman.pug ./templates/page/works/[projectName].pug`

## Downsize images

`sips -Z 1130 img/works/**/*.jpg` 
`sips -Z 560 img/works/**/*.jpg` 
