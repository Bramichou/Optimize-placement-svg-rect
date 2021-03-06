const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const NS_LINK = 'http://www.w3.org/2000/svg'

let container =  document.createElementNS(NS_LINK, "svg")
let body = document.querySelector('body')

container.setAttribute('width', WIDTH)
container.setAttribute('height', HEIGHT)

body.appendChild(container)

let widthMainBox = params.mainBox.width
let heightMainBox = params.mainBox.height

function init(){
    paintMainBox(widthMainBox, heightMainBox)
    //paintSubBoxs(10, widthMainBox, heightMainBox)

    betterPlacementBox(params.nb_Rep, params.nb_box)
}


/**
 * Dessin de la mainBox
 * @param widthMainBox
 * @param heightMainBox
 */
function paintMainBox(widthMainBox, heightMainBox){
    let mainBox = document.createElementNS(NS_LINK, 'rect')

    mainBox.setAttribute('width', widthMainBox)
    mainBox.setAttribute('height', heightMainBox)
    mainBox.setAttribute('x', WIDTH/2 - (widthMainBox/2))
    mainBox.setAttribute('y', HEIGHT/2 - (heightMainBox/2))
    mainBox.setAttribute('style', 'stroke:none; fill:black')

    container.appendChild(mainBox)
}

/**
 * Dessin des subBoxs
 * @param nb_Box
 * @param widthMainBox
 * @param heightMainBox
 * @returns {Element}
 */
function paintSubBoxs(nb_Box, widthMainBox, heightMainBox){

    const heightSubBox = 70

    let wMainBox = widthMainBox
    let hMainBox = heightMainBox

    let n_Box = nb_Box || 20

    let g = document.createElementNS(NS_LINK, 'g')

    for(let i = 0; i < n_Box; i ++){
        let widthSubBox = getRandom(120, 200)
        let subBox = document.createElementNS(NS_LINK, 'rect')
        let randPosY = getRandom(0, HEIGHT - heightSubBox)
        let randPosX

        if(randPosY > ((HEIGHT/2 - (hMainBox/2)) - heightSubBox) && randPosY < (HEIGHT/2 + (hMainBox/2))){
            let randVal = Math.round(Math.random())

            randPosX = randVal ? Math.round(Math.random() * ((WIDTH/2 - wMainBox/2) - widthSubBox)) : getRandom(WIDTH/2 + wMainBox/2, WIDTH - widthSubBox)
        }
        else
            randPosX = getRandom(0, WIDTH - widthSubBox)

        subBox.setAttribute('width', widthSubBox)
        subBox.setAttribute('height', heightSubBox)
        subBox.setAttribute('x', randPosX)
        subBox.setAttribute('y', randPosY)
        subBox.setAttribute('style', 'stroke:black; fill:red')


        g.appendChild(subBox)
    }

    return g
}

/** UTILS **/

function getRandom(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}



/**
 * Fonction qui permet de trouver le meilleur placement possible
 * @param nbRep
 * @param nb_box
 */
function betterPlacementBox(nbRep, nb_box){
    console.time('Durée fonction de placement')
    let nRep = nbRep

    // Historique des placements
    let allGroup = []
    let tab_dispositions = []
    let bestPlacement
    let isStarted = false

    for (let i = 0; i < nRep; i++){
        let g_elem = paintSubBoxs(nb_box, widthMainBox, heightMainBox)
        let tab_rec = g_elem.children

        let group = {
            surface : 0,
            element : []
        }

        let theCost=calculateCostForDisposition(tab_rec);
        console.log(i,theCost)

        if(theCost != 0){
            group.surface = theCost;
            group.element[0] = (tab_rec)
            allGroup.push(group)

            if(!isStarted){
                bestPlacement = tab_rec
                tab_dispositions.push(theCost, bestPlacement)
                isStarted = !isStarted
            }

            if(theCost < tab_dispositions[0]){
                bestPlacement = tab_rec

                tab_dispositions[0] = theCost
                tab_dispositions[1] = bestPlacement
            }
            else{
                continue
            }
        }
        else{
            group.surface = theCost;
            group.element[0] = (tab_rec)
            allGroup.push(group)

            bestPlacement = tab_rec
            tab_dispositions[0] = theCost
            tab_dispositions[1] = bestPlacement

            break
        }
    }

    container.appendChild(bestPlacement[0].parentNode)
    console.timeEnd('Durée fonction de placement')
    console.info('Meilleur surface totale ' + tab_dispositions[0])
    console.info('Nombre d\'iteration', nbRep)
    //console.info("Historique", allGroup)
}

/**
 * Fonction qui permet de savoir si une pair a déjà été check
 * @param rectCurr
 * @param rectNext
 * @param tab_pair
 * @returns {boolean}
 */
function isPairInTable(rectCurr, rectNext, tab_pair){
    let isPair = false

    //console.log('tabPair', tab_pair)
    //console.log(rectCurr, rectNext)



    for(let i = 0; i < tab_pair.length; i++){
        let rectFirst = tab_pair[i][0]
        let rectSecond = tab_pair[i][1]

        if((rectCurr == rectFirst && rectNext == rectSecond) || (rectNext == rectFirst && rectCurr == rectSecond))
            isPair = !isPair
    }

    //console.log(isPair)
    return isPair
}



/**
 * Fonction qui permet de calculer pour une "disposition" qui est un ensemble de rectangle, le cout total
 * @param tab_rect
 * @returns {number}
 */

let tab_pair = []

function calculateCostForDisposition(tab_rect){
    let totalCost = 0

    for(let i = 0; i < tab_rect.length; i++){
        let currRect = tab_rect[i]
        for(let j = 0; j < tab_rect.length; j++){
            nextRect = tab_rect[j]
            if(currRect != nextRect){

                let pair = [currRect, nextRect]
                console.log(pair)
                console.log(currRect, nextRect)
                console.log(isPairInTable(currRect, nextRect, tab_pair))

                //totalCost += caseManagementPoint(currRect, nextRect)


                if(!isPairInTable(currRect, nextRect, tab_pair)){
                    tab_pair.push(pair)
                    totalCost += caseManagementPoint(currRect, nextRect)
                }

            }
        }
    }

    return totalCost
}


/**
 * Fonction qui permet de gerer l'intersection de deux rectangles
 * @param currentRect
 * @param nextRect
 * @returns {number}
 */
function caseManagementPoint(currentRect, nextRect){
    let pointsCurrentRect = getPointOfRectangle(currentRect)
    let pointsNextRect = getPointOfRectangle(nextRect)
    let pointsNextInCurrent = isPointsInRectangle(pointsCurrentRect, pointsNextRect)
    let costResult = calculateCost(pointsCurrentRect, pointsNextRect, pointsNextInCurrent)

    return costResult

}


/**
 * Fonction qui permet de calculer la surface de deux intersections
 * @param pointsCurrRect
 * @param pointsNextRect
 * @param pointsNextRectInCurr
 * @returns {number}
 */
function calculateCost(pointsCurrRect, pointsNextRect, pointsNextRectInCurr){
    let cost = 0
    let surface = 0
    let longueur, largeur

    // Case when 4 points are in rectangle

    if(pointsNextRectInCurr.a && pointsNextRectInCurr.b && pointsNextRectInCurr.c && pointsNextRectInCurr.d){
        longueur = pointsNextRect.b.x - pointsNextRect.a.x
        largeur = pointsNextRect.d.y - pointsNextRect.a.y
        surface = longueur * largeur
    }

    // Case When 2 Points are in rectangle

    // A & B
    else if(pointsNextRectInCurr.a && pointsNextRectInCurr.b){
        longueur = pointsNextRect.b.x - pointsNextRect.a.x
        largeur = pointsCurrRect.d.y - pointsNextRect.a.y
        surface = longueur * largeur
    }

    // B & C
    else if(pointsNextRectInCurr.b && pointsNextRectInCurr.c){
        longueur = pointsNextRect.b.x - pointsCurrRect.a.x
        largeur = pointsNextRect.c.y - pointsNextRect.b.y
        surface = longueur * largeur
    }

    // C & D
    else if(pointsNextRectInCurr.c && pointsNextRectInCurr.d){
        longueur = pointsNextRect.c.x - pointsNextRect.d.x
        largeur = pointsNextRect.d.y - pointsCurrRect.a.y
        surface = longueur * largeur
    }

    // A & D
    else if(pointsNextRectInCurr.a && pointsNextRectInCurr.d){
        longueur = pointsCurrRect.b.x - pointsNextRect.a.x
        largeur = pointsNextRect.d.y - pointsNextRect.a.y
        surface = longueur * largeur
    }

    // Case only 1 point

    // A
    else if(pointsNextRectInCurr.a){
        longueur = pointsCurrRect.b.x - pointsNextRect.a.x
        largeur = pointsCurrRect.d.y - pointsNextRect.a.y
        surface = longueur * largeur
    }

    // B
    else if(pointsNextRectInCurr.b){
        longueur = pointsNextRect.b.x - pointsCurrRect.a.x
        largeur = pointsCurrRect.d.y - pointsNextRect.b.y
        surface = longueur * largeur
    }

    // C
    else if(pointsNextRectInCurr.c){
        longueur = pointsNextRect.c.x - pointsCurrRect.a.x
        largeur = pointsNextRect.c.y - pointsCurrRect.a.y
        surface = longueur * largeur
    }

    // D
    else if(pointsNextRectInCurr.d){
        longueur = pointsCurrRect.b.x - pointsNextRect.d.x
        largeur = pointsNextRect.d.y - pointsCurrRect.b.y
        surface = longueur * largeur
    }

    else{
        surface = 0
    }

    cost = surface

    return cost
}

/**
 * Fonction qui permet de savoir quel(s) point(s) du rectangle suivant se trouve dans le rectangle courant
 * @param pointsCurrRect
 * @param pointsNextRect
 * @returns {{a: boolean, b: boolean, c: boolean, d: boolean}}
 */

function isPointsInRectangle(pointsCurrRect, pointsNextRect){
    let points = {
        a : false,
        b : false,
        c : false,
        d : false
    }

    if(isPointNextRectInCurrRectangle(pointsNextRect.a, pointsCurrRect))
        points.a = true
    if(isPointNextRectInCurrRectangle(pointsNextRect.b, pointsCurrRect))
        points.b = true
    if(isPointNextRectInCurrRectangle(pointsNextRect.c, pointsCurrRect))
        points.c = true
    if(isPointNextRectInCurrRectangle(pointsNextRect.d, pointsCurrRect))
        points.d = true

    return points
}


/**
 * Function qui permet en fonction des points d'un rectangle courant et suivant, de savoir si le rectangle suivant est dans le courant
 * @param pointNextRect
 * @param pointsCurrRect
 * @returns {boolean}
 */
function isPointNextRectInCurrRectangle(pointNextRect, pointsCurrRect){

    if(pointNextRect.x >= pointsCurrRect.a.x && pointNextRect.x <= pointsCurrRect.b.x){
        if(pointNextRect.y >= pointsCurrRect.a.y && pointNextRect.y <= pointsCurrRect.d.y){
            return true
        }
        else{
            return false
        }
    }
    else{
        return false
    }
}

/**
 * Fonction permettant de calculer tout les points d'un rectangle
 * @param rect
 * @returns {{a: {x: (string|Number), y: (string|Number)}, b: {x: *, y: (string|Number)}, c: {x: *, y: *}, d: {x: (string|Number), y: *}}}
 */

function getPointOfRectangle(rect){
    let pointsRect = {
        a : {
            x : rect.x.baseVal.value,
            y : rect.y.baseVal.value
        },
        b : {
            x : rect.x.baseVal.value + rect.width.baseVal.value,
            y : rect.y.baseVal.value
        },
        c : {
            x : rect.x.baseVal.value + rect.width.baseVal.value,
            y : rect.y.baseVal.value + rect.height.baseVal.value
        },
        d : {
            x : rect.x.baseVal.value,
            y : rect.y.baseVal.value + rect.height.baseVal.value
        }
    }

    return pointsRect
}


/**
 * WORK IN PROGRESS
 * Fonction permettant de supprimer le groupe de rectangle actuel et le remplacer par le suivant
 * @param currentRectGrp Groupe de rectangle courant
 * @param newRectGrp    Gro
 */

function changeElemInDom(currentRectGrp, newRectGrp){
    let curGrp = currentRectGrp
    let newGrp = newRectGrp

    curGrp.parentNode.remove()

    let svg = document.querySelector('svg')
    svg.appendChild(newGrp)
}

window.addEventListener('load', init)