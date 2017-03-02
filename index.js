const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const NS_LINK = 'http://www.w3.org/2000/svg'

let container =  document.createElementNS(NS_LINK, "svg")
let body = document.querySelector('body')

container.setAttribute('width', WIDTH)
container.setAttribute('height', HEIGHT)

body.appendChild(container)

let widthMainBox = 600
let heightMainBox = 300

function init(){
    paintMainBox(widthMainBox, heightMainBox)
    //paintSubBoxs(10, widthMainBox, heightMainBox)

    betterPlacementBox(30000, 30)
}

function paintMainBox(widthMainBox, heightMainBox){
    let mainBox = document.createElementNS(NS_LINK, 'rect')

    mainBox.setAttribute('width', widthMainBox)
    mainBox.setAttribute('height', heightMainBox)
    mainBox.setAttribute('x', WIDTH/2 - (widthMainBox/2))
    mainBox.setAttribute('y', HEIGHT/2 - (heightMainBox/2))
    mainBox.setAttribute('style', 'stroke:none; fill:black')

    container.appendChild(mainBox)
}


function paintSubBoxs(nb_Box, widthMainBox, heightMainBox){
    let widthSubBox = 200
    const heightSubBox = 70

    let wMainBox = widthMainBox
    let hMainBox = heightMainBox

    let n_Box = nb_Box || 20

    let g = document.createElementNS(NS_LINK, 'g')

    for(let i = 0; i < n_Box; i ++){

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

function betterPlacementBox(nbRep, nb_box){
    console.time('Durée fonction de placement')
    let nRep = nbRep

    let tab_dispositions = []
    let bestPlacement
    let isStarted = false

    for (let i = 0; i < nRep; i++){
        let g_elem = paintSubBoxs(nb_box, widthMainBox, heightMainBox)
        let tab_rec = g_elem.children

        if(!isStarted){
            bestPlacement = tab_rec
            tab_dispositions.push(calculateCostForDisposition(tab_rec), bestPlacement)
            isStarted = !isStarted
        }
        if(calculateCostForDisposition(tab_rec) < tab_dispositions[0]){
            bestPlacement = tab_rec


            tab_dispositions[0] = calculateCostForDisposition(tab_rec)
            tab_dispositions[1] = bestPlacement
        }
        else{
            continue
        }
    }

    container.appendChild(bestPlacement[0].parentNode)
    console.timeEnd('Durée fonction de placement')
    console.info('Meilleur surface totale ' + tab_dispositions[0])
    console.info('Nombre d\'iteration', nbRep)

}

function calculateCostForDisposition(tab_rect){
    let totalCost = 0

    for(let i = 0; i < tab_rect.length; i++){
        let currRect = tab_rect[i]
            for(let j = 0; j < tab_rect.length; j++){
                nextRect = tab_rect[j]
                if(currRect != nextRect){
                    totalCost += caseManagementPoint(currRect, nextRect)
                }
            }
    }

    return totalCost
}



function caseManagementPoint(currentRect, nextRect){
    let pointsCurrentRect = getPointOfRectangle(currentRect)
    let pointsNextRect = getPointOfRectangle(nextRect)
    let pointsNextInCurrent = isPointsInRectangle(pointsCurrentRect, pointsNextRect)
    let costResult = calculateCost(pointsCurrentRect, pointsNextRect, pointsNextInCurrent)

    return costResult

}

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


function getNumberPointInRectangle(points){
    let nbPointInRectangle = 0

    for( value  in points){
        if (points[value])
            nbPointInRectangle++
    }

    return nbPointInRectangle
}


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


window.addEventListener('load', init)

