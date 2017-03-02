# Stochastic algorithm with svg rect around a main rect

I experimented the stochastic algorithm on an example of interface which can be
use in interfaces to place randomly "divs" with the best placement possible which depend the number of the iterations

https://en.wikipedia.org/wiki/Stochastic_optimization

## How to test it ?


```javascript
let params = {
    mainBox: {
      width  : 800,  // Width of the main box which will be place in the center of the page
      height : 200  // Height of the main box which will be place in the center of the page
    },
    nb_box : 20,    // Number of box to place arround the main box
    nb_Rep : 1000   /** Number iteration/repetition to do to get the best placement (using stochastic algorithm),
                     ** The Higher the number, the longer the load will be
                    **/
}
```


    