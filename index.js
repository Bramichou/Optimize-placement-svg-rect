const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const NS_LINK = 'http://www.w3.org/2000/svg'

let container =  document.createElementNS(NS_LINK, "svg")
let body = document.querySelector('body')

container.setAttribute('width', WIDTH)
container.setAttribute('height', HEIGHT)

body.appendChild(container)

function paintMainBox(){
    let mainBox = document.createElementNS(NS_LINK, 'rect')
    let widthMainBox = 600
    let heightMainBox = 300


    mainBox.setAttribute('width', widthMainBox)
    mainBox.setAttribute('height', heightMainBox)
    mainBox.setAttribute('x', WIDTH/2 - (widthMainBox/2))
    mainBox.setAttribute('y', HEIGHT/2 - (heightMainBox/2))
    mainBox.setAttribute('style', 'stroke:none; fill:black')

    container.appendChild(mainBox)

    paintSubBoxs(widthMainBox, heightMainBox)
}


function paintSubBoxs(widthMainBox, heightMainBox){
    let widthSubBox = 200
    const heightSubBox = 70

    let wMainBox = widthMainBox
    let hMainBox = heightMainBox

    let nb_Box = 2

    let g = document.createElement('g')

    for(let i = 0; i < nb_Box; i ++){

        let subBox = document.createElementNS(NS_LINK, 'rect')
        let randPosY = getRandom(0, HEIGHT - heightSubBox)
        let randPosX

        if(randPosY > ((HEIGHT/2 - (hMainBox/2)) - heightSubBox) && randPosY < (HEIGHT/2 + (hMainBox/2))){
            let randVal = Math.round(Math.random())

            randPosX = randVal ? Math.random() * ((WIDTH/2 - wMainBox/2) - widthSubBox) : getRandom(WIDTH/2 + wMainBox/2, WIDTH - widthSubBox)
        }
        else
            randPosX = getRandom(0, WIDTH - widthSubBox)

        subBox.setAttribute('width', widthSubBox)
        subBox.setAttribute('height', heightSubBox)
        subBox.setAttribute('x', randPosX)
        subBox.setAttribute('y', randPosY)
        subBox.setAttribute('style', 'stroke:none; fill:red')


        container.appendChild(subBox)
    }
}


function paintMainBoxWithSubBoxs(){
    paintMainBox()
}

/** UTILS **/

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}


function caseManagementPoint(currentRect, nextRect){
    let pointsCurrentRect = getPointOfRectangle(currentRect)
    let pointsNextRect = getPointOfRectangle(nextRect)
    let pointsNextInCurrent = isPointsInRectangle(pointsCurrentRect, pointsNextRect)

    console.log('nb point dans rec curr', getNumberPointInRectangle(pointsNextInCurrent))
    console.info('detail', pointsNextInCurrent)

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
        surface = longueur*largeur
    }

    // B & C
    else if(){

    }

    // A & D
    else if(pointsNextRectInCurr.a && pointsNextRectInCurr.d){
        longueur = pointsCurrRect.b.x - pointsNextRect.a.x
        largeur = pointsNextRect.d.y - pointsNextRect.a.y
        surface = longueur * largeur
    }






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


window.addEventListener('load', paintMainBoxWithSubBoxs)

